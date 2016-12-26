"use strict";
let readlineSync = require('readline-sync'),
    ObjectID = require('mongodb').ObjectID;

function DbApi(db, appCallback) {

    this.collectionInsert = ( oCollection ) => {
        let oInsertObject = this.getInsertObject( oCollection.fields ),
            foreignKeys = this.getForeignKeys( oCollection.fields ),
            fnInsert = () => {
                let oRemoteCollection = db.collection(oCollection.collectionName);
                oRemoteCollection.insert(oInsertObject, function(err) {
                    if (err)
                        console.log(err.message);
                    else
                        console.log("\nCreate successful!");
                    appCallback.call();
                })
            };
        if(foreignKeys.length) {
            this.checkForeign(oInsertObject, foreignKeys, fnInsert)
        } else {
            fnInsert()
        }
    };
    this.collectionFind = ( oCollection ) => {
        let oInsertObject = this.getInsertObject( oCollection.fields, true ),
            oRemoteCollection = db.collection(oCollection.collectionName);

        oRemoteCollection.find(oInsertObject).toArray(function(err, aDocuments) {
            if (aDocuments.length)
                console.log(aDocuments);
            else
                console.log(`\nNobody is here!`);
            appCallback.call();
        });
    };
    this.collectionUpdate = (oCollection) => {
        let oRemoteCollection = db.collection(oCollection.collectionName),
            foreignKeys = this.getForeignKeys( oCollection.fields ),
            oId = this.getIdInput("id"),
            oInsertObject = this.getInsertObject( oCollection.fields ),
            fnUpdate = () => {
                oRemoteCollection.update({ "_id": oId }, oInsertObject, function(err, item) {
                    if(err)
                        console.log(err);
                    else
                        console.log("\nSuccess!");
                    appCallback.call()
                })
            };
        if(foreignKeys.length) {
            this.checkForeign(oInsertObject, foreignKeys, fnUpdate)
        } else {
            fnUpdate()
        }
    };
    this.collectionDelete = (oCollection) => {
        let oRemoteCollection = db.collection(oCollection.collectionName),
            foreignKeys = this.getForeignKeys( oCollection.fields ),
            oId = this.getIdInput("id");

        oRemoteCollection.findAndRemove({ "_id": oId }, function(err) {
                    if(err)
                        console.log(err);
                    else
                        console.log("\nSuccess!");
                    appCallback.call()
                })

    };
    this.checkForeign = ( oInsertObject, foreignKeys, callback ) => {
        let keysLength = foreignKeys.length;
        if( keysLength > 0 ) {
            let oCollection = db.collection(foreignKeys[keysLength - 1].refs),
                oFindResult = oCollection.find({
                    "_id" : oInsertObject[foreignKeys[keysLength - 1].name]
                });

            oFindResult.toArray(function(err, aDocuments) {
                if (aDocuments.length) {
                    this.checkForeign(oInsertObject, foreignKeys.pop(), callback);
                } else {
                    console.log(`Cannot find ${foreignKeys[keysLength - 1].refs} with inputted ID\n`)
                    appCallback.call();
                }
            }.bind(this));
        } else {
            callback.call()
        }
    };
    this.getInsertObject = ( oFields, isFind ) => {
        let oObject = {};
        Object.keys(oFields).forEach(function(key, i){
            if( key != "_id" ) {
                if (oFields[key].isId)
                    oObject[key] = this.getIdInput(key, isFind);
                else
                    oObject[key] = readlineSync.question(`\n${key} value: `);
            }
            if(isFind && oObject[key] == "*")
                delete oObject[key];
        }.bind(this));
        return oObject;
    };

    this.getForeignKeys = ( oFields ) => {
        let aForeignKeys = [];
        Object.keys(oFields).forEach(function(key, i){
            if( key != "_id" && oFields[key].hasOwnProperty("constraint") &&
                oFields[key].constraint.hasOwnProperty("foreign")) aForeignKeys.push({
                    name: key,
                    refName: oFields[key].constraint.foreign.field,
                    refs: oFields[key].constraint.foreign.collection
            });
        }.bind(this));
        return aForeignKeys;
    };

    this.getIdInput = ( key, isFind ) => {
        let sHexString = "";
        while ( ( sHexString == "" || sHexString.length != 24 || !sHexString.match(/(^[0-9a-f]*$)/) ) &&
                !(isFind && sHexString == "*") )
            sHexString = readlineSync.question(`\n${key} value(24 hex symbols): `);
        return (isFind && sHexString == "*") ? sHexString : ObjectID.createFromHexString(sHexString);
    };
}
module.exports = DbApi;
