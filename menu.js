var assert = require("assert"),
    readlineSync = require('readline-sync');
function Menu() {
    this._aCollections = [
        "City",
        "Hospital",
        "MilitaryCounty",
        "MilitaryOffice",
        "MilitaryUnit",
        "Exit"
    ];
    this.printMenu = function () {
        console.log();
    };
    this.getCollectionName = function () {
        var iChoice = readlineSync.question("Select collection:" +
                "\n1. City" +
                "\n2. Hospital" +
                "\n3. Military county" +
                "\n4. Military office" +
                "\n5. Military unit" +
                "\n6. Exit\n") - 1;
        if( !isNaN(+iChoice) && ( iChoice >= 0 && iChoice <= 5 ) ) {
            return this._aCollections[iChoice];
        } else {
            console.log("ERROR: wrong input.\n");
            return this.getCollectionName();
        }
    };
    this._getOperation = function () {
        var iChoice = readlineSync.question("\nSelect operation:" +
                "\n1. C" +
                "\n2. R" +
                "\n3. U" +
                "\n4. D" +
                "\n5. Exit\n");
        if( !isNaN(+iChoice)  && ( iChoice >= 1 && iChoice <= 5 ) ) {
            var sOperation = "";
            switch(parseInt(iChoice, 10)){
                case 1:
                sOperation = "C";
                    break;
                case 2:
                sOperation = "R";
                    break;
                case 3:
                    sOperation = "U";
                    break;
                case 4:
                    sOperation = "D";
                    break;
                case 5:
                    sOperation = "E";
                    break;
            }
            return sOperation;
        } else {
            console.log("ERROR: wrong input.\n");
            return this._getOperation();
        }
    };
    this.getCityAction = function () {
        var sOperation = this._getOperation();
        return {
            name: "city",
            operation: sOperation
        }
    };
    this.getHospitalAction = function () {
        var sOperation = this._getOperation();
        return {
            name: "hospital",
            operation: sOperation
        }
    };
    this.getMilitaryCountyAction = function () {
        var sOperation = this._getOperation();
        return {
            name: "military_county",
            operation: sOperation
        }
    };
    this.getMilitaryOfficeAction = function () {
        var sOperation = this._getOperation();
        return {
            name: "military_office",
            operation: sOperation
        }
    };
    this.getMilitaryUnitAction = function () {
        var sOperation = this._getOperation();
        return {
            name: "military_unit",
            operation: sOperation
        }
    };
    this.getExitAction = function () {
        process.exit();
    };
}
module.exports = Menu;