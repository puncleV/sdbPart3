"use strict";
let assert = require("assert"),
    readlineSync = require('readline-sync');
function Menu( oCollections ) {
    this.oCollections = oCollections;
    this.oMenu = null;
    this.iMaxMenuChoice = 0;

    this.getUserChoice = () => {
        if( !this.oMenu ) {
            this.createMenuObject();
            this.sMenu = "";
            for( let i in this.oMenu )  this.sMenu += `\n${this.oMenu[i].index + 1}) ${this.oMenu[i].name}`;
        }
        this.printCollectionMenu();

        let iChoice = -1,
            result = null;
        while( iChoice < 0 || iChoice > this.iMaxMenuChoice + 1 || isNaN(iChoice) || iChoice == "")
            iChoice = readlineSync.question("\nYour choice ( 0 to exit ) : ");

        if( iChoice != 0 ) {
            result = this.getMenuObjectById(iChoice - 1);
            result.operation = this.getOperation();
            if( result.operation == "0" ) result = null;
        }

        return result;
    };
    this.getOperation = () => {
        let iChoice = -1;

        this.printMenu("" +
            "\n1)C" +
            "\n2)R" +
            "\n3)U" +
            "\n4)D");
        while( iChoice < 0 || iChoice > 4 || isNaN(iChoice) || iChoice == "")
            iChoice = readlineSync.question("\nYour choice ( 0 to exit ) : ");

        return iChoice;
    };

    this.printCollectionMenu = () => {
        this.printMenu(this.sMenu);
    };
    this.printMenu = (sMenu) => {
        if(sMenu) console.log(sMenu);
    };
    this.getMenuObjectById = (iId) => {
        let oMenuObject = {};
        Object.keys(this.oMenu).forEach(function(key, i){
            if( iId == i )
                oMenuObject = this.oMenu[key];
        }.bind(this));
        return oMenuObject;
    };

    this.createMenuObject = () => {
        this.oMenu = {};
        Object.keys(this.oCollections).forEach(function(key, i){
            this.oMenu[key] = {};
            this.oMenu[key].index = i;
            this.oMenu[key].name = this.oCollections[key].name;
            this.oMenu[key].collectionName = key;
            if( this.iMaxMenuChoice < i ) this.iMaxMenuChoice = i;
        }.bind(this));
    }
}
module.exports = Menu;