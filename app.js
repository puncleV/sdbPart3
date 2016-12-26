var Db = require("mongodb").Db,
    assert = require("assert"),
    Menu = require("./menu"),
    Server = require('mongodb').Server,
    DbApi = require("./dbapi"),
    sleep = require('sleep');

var sUrl = "mongodb://localhost:27017/";
console.log("Try to connect " + sUrl);
var db = Db('STUD', new Server('localhost', 27017));
db.open(function(err, db) {
    assert.equal(null, err);
    // console.dir(db)
    console.log("You are successful connected to database.");
    var oMenu = new Menu(),
        oDbApi = new DbApi(db),
        oCollection = oMenu["get" + oMenu.getCollectionName() + "Action"](),
        sOperation = oCollection.operation;
    if (sOperation != "E") {
        oDbApi["fn" + sOperation + "Collection"](oCollection.name, function () {
            db.close()
        });
    } else {
        db.close();
    }
});
