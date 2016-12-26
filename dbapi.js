var readlineSync = require('readline-sync'),
    ObjectID = require('mongodb').ObjectID;

function DbApi(db) {
    this.db = db;
    this.fnRCollection = function(sCollectionName, fnCloseCallback) {
        var oCollection = this.db.collection(sCollectionName),
            fnGetCollectionFields = this["get" + sCollectionName + "Fields"],
            oFields = fnGetCollectionFields.call(this),
            oFindResult = oCollection.find(oFields);

        oFindResult.toArray(function(err, aDocuments) {
            if (aDocuments.length)
                aDocuments.forEach(function(oDocument, i) {
                    console.log("#" + i);
                    for (var i in oDocument)
                        console.log(i + ": " + oDocument[i])
                });
            else
                console.log("Nothing was found\n")
            fnCloseCallback()
        });
    };
    this.fnCCollection = function(sCollectionName, fnCloseCallback) {
        var oCollection = this.db.collection(sCollectionName),
            fnGetCollectionFields = this["get" + sCollectionName + "Fields"],
            fnValidateCollectionFields = this["validate" + sCollectionName + "Fields"],
            fnCheckConstraint = this["check" + sCollectionName + "Constraint"],
            oFields = {};

        while (!fnValidateCollectionFields.call(this, oFields)) {
            oFields = fnGetCollectionFields.call(this);
        }
        // console.log("check" + sCollectionName + "Constraint")
        fnCheckConstraint.call(this, oFields ,function () {
            oCollection.insert(oFields, function(err) {
                if (err)
                    console.log(err.message);
                else
                    console.log("Create successful!\n")
                fnCloseCallback();
            })
        });
        var oCollection = this.db.collection(sCollectionName),
            sId = this.getId("Insert id: ");
        oCollection.update({ "_id": ObjectID.createFromHexString(sId) }, this["get" + sCollectionName + "Fields"](), function(err, item) {
            console.log(err)
            console.log(item)
        })
        fnCloseCallback();
    };
    this.fnUCollection = function(sCollectionName, fnCloseCallback) {

    };
    this.fnDCollection = function(sCollectionName, fnCloseCallback) {
        var oCollection = this.db.collection(sCollectionName),
            sId = this.getId("Insert id: ");
        oCollection.findAndRemove({ "_id": ObjectID.createFromHexString(sId) }, function(err, resp) {
            if(err)
                console.log(err);
            else
                console.log("Item deleted successful\n")
        })
        fnCloseCallback();
    };
    this.checkcityConstraint = function (oFields, fnCallback) {
        var oCollection = this.db.collection("military_county"),

            oFindResult = oCollection.find({
                "_id" : ObjectID.createFromHexString(oFields.county_id)
            });

        oFindResult.toArray(function(err, aDocuments) {
            if (aDocuments.length)
                fnCallback.call(this);
            else
                console.log("Cannot find county with inputted ID\n")
        });
    };
    this.checkmilitary_countyConstraint = function (oFields, fnCallback) {
        fnCallback.call(this)
    };
    this.checkmilitary_unitConstraint = function (oFields, fnCallback) {
        var oCollection = this.db.collection("military_county"),

            oFindResult = oCollection.find({
                "_id" : ObjectID.createFromHexString(oFields.county_id)
            });

        oFindResult.toArray(function(err, aDocuments) {
            if (aDocuments.length)
                fnCallback.call(this);
            else
                console.log("Cannot find county with inputted ID\n")
            // this.db.close();
        });
    };
    this.checkhospitalConstraint = function (oFields, fnCallback) {
        var oCollection = this.db.collection("city"),

            oFindResult = oCollection.find({
                "_id" : ObjectID.createFromHexString(oFields.city_id)
            });

        oFindResult.toArray(function(err, aDocuments) {
            if (aDocuments.length)
                fnCallback.call(this);
            else
                console.log("Cannot find county with inputted ID\n")
            // this.db.close();
        });
    };
    this.validateFields = function(aRules, oFields) {

    };
    this.getId = function(sPrompt) {
        return readlineSync.question(sPrompt);
    };
    this.isAllValues = function (sValue) {
        return sValue == "*";
    };
    this.getmilitary_countyFields = function(sPrompt) {
        var sName = "",
            oFields = {};

        while (!sName) {
            sName = readlineSync.question("Name:\n")
        }

        if(!this.isAllValues(sName))
            oFields.name = sName;

        return oFields;
    };
    this.validatemilitary_countyFields = function(oFields) {
        var bIsValid = true;
        return oFields.name ? true : false;
    };
    this.getcityFields = function() {
        var sArea = "",
            sName = "",
            sCountyId = "",
            oFields = {};

        while (!sArea) {
            sArea = readlineSync.question("\nArea: ")
        }

        while (!sName) {
            sName = readlineSync.question("\nName: ")
        }

        while (!sCountyId) {
            sCountyId = readlineSync.question("\nCountyId: ")
        }
        
        if(!this.isAllValues(sArea))
            oFields.area = sArea;
        if(!this.isAllValues(sName))
            oFields.name = sName;
        if(!this.isAllValues(sCountyId))
            oFields.county_id = sCountyId;

        return oFields;
    };
    this.validatecityFields = function(oFields) {
        var bIsValid = true;
        if( oFields.county_id && (oFields.county_id.length != 24 || !oFields.county_id.match(/(^[0-9a-f]*$)/))){
            bIsValid = false;
            console.log("county id must be string of 24 hex characters");
        }
        return oFields.county_id && bIsValid;
    };
    this.gethospitalFields = function() {
        var sAddress = "",
            sName = "",
            sMap = "",
            sCityId = "",
            oFields = {};

        while (!sAddress) {
            sAddress = readlineSync.question("\nAddress: ")
        }

        while (!sName) {
            sName = readlineSync.question("\nName: ")
        }

        while (!sMap) {
            sMap = readlineSync.question("\nMap: ")
        }

        while (!sCityId) {
            sCityId = readlineSync.question("\nCity id: ")
        }

        if(!this.isAllValues(sAddress))
            oFields.address = sAddress;
        if(!this.isAllValues(sName))
            oFields.name = sName;
        if(!this.isAllValues(sMap))
            oFields.map = sMap;
        if(!this.isAllValues(sCityId))
            oFields.city_id = sCityId;

        return oFields;
    };
    this.validatehospitalFields = function(oFields) {
        // var aRules = [{
        //     field: "address"
        // }]

        var bIsValid = true;
        // for (var i in aRules) {
        //     if (!oFields[aRules[i].field])
        //         bIsValid = false
        // }
        return oFields.city_id;
    };
    this.getmilitary_officeFields = function() {
        var sAddress = "";
        while (!sAddress) {
            sAddress = readlineSync.question("Address:\n")
        }
        return { address: sAddress };
    };
    this.validatemilitary_officeFields = function(oFields) {
        return oFields.address ? true : false;
    };
    this.getmilitary_unitFields = function() {
        var sMaxCapacity = "",
            sPopulation = "",
            sCountyId = "",
            oFields = {};

        while (!sMaxCapacity) {
            sMaxCapacity = readlineSync.question("\nMax capacity: ")
        }

        while (!sPopulation) {
            sPopulation = readlineSync.question("\nPopulation: ")
        }

        while (!sCountyId) {
            sCountyId = readlineSync.question("\nCounty id: ")
        }


        if(!this.isAllValues(sMaxCapacity))
            oFields.max_capacity = sMaxCapacity;
        if(!this.isAllValues(sPopulation))
            oFields.population = sPopulation;
        if(!this.isAllValues(sCountyId))
            oFields.county_id = sCountyId;

        return oFields;
    };
    this.validatemilitary_unitFields = function(oFields) {
        var bIsValid = true;
        if( oFields.county_id && (oFields.county_id.length != 24 || oFields.county_id.match(/[g-z]/))){
            bIsValid = false;
            console.log("County id must be string of 24 hex characters");
        }
        return oFields.county_id && bIsValid;
    }
}
module.exports = DbApi;
