"use strict";
let Db = require("mongodb").Db,
    assert = require("assert"),
    Menu = require("./menu"),
    Server = require('mongodb').Server,
    DbApi = require("./dbapi");

let sUrl = "mongodb://localhost:27017/",
    db = Db('STUD', new Server('localhost', 27017)),
    oCollections = {
        clients: {
            name: "Clients",
            collectionName: "clients",
            fields: {
                _id: {
                    searchBy: false,
                    isId: true
                },
                Identity: {
                    searchBy: true
                },
                RegDate: {
                    searchBy: true
                }
            }
        },
        images: {
            name: "Images",
            collectionName: "images",
            fields: {
                _id: {
                    searchBy: true,
                    isId: true
                },
                image: {
                    searchBy: false
                }
            }
        },
        roomTypes: {
            name: "Room types",
            collectionName: "roomTypes",
            fields: {
                _id: {
                    searchBy: false,
                    isId: true
                },
                roomsCount: {
                    searchBy: false
                },
                bedsCount: {
                    searchBy: false
                },
                description: {
                    searchBy: false
                },
                image_id: {
                    searchBy: true,
                    constraint: {
                        foreign: {
                            collection: "images",
                            field: "_id"
                        }
                    },
                    isId: true
                }
            }
        },
        rooms: {
            name: "Rooms",
            collectionName: "rooms",
            fields: {
                _id: {
                    searchBy: false,
                    isId: true
                },
                number: {
                    searchBy: true
                },
                type_id: {
                    searchBy: true,
                    constraint: {
                        foreign: {
                            collection: "roomTypes",
                            field: "_id"
                        }
                    },
                    isId: true
                }
            }
        },
        reserve: {
            name: "Reserves",
            collectionName: "reserve",
            fields: {
                _id: {
                    searchBy: false,
                    isId: true
                },
                number: {
                    searchBy: true
                },
                room_id: {
                    searchBy: true,
                    constraint: {
                        foreign: {
                            collection: "rooms",
                            field: "_id"
                        }
                    },
                    isId: true
                },
                client_id: {
                    searchBy: true,
                    constraint: {
                        foreign: {
                            collection: "clients",
                            field: "_id"
                        }
                    },
                    isId: true
                },
                note: {
                    searchBy: false
                }
            }
        }
    };

console.log("Try to connect " + sUrl);

db.open((err, db) => {
    assert.equal(null, err);
    console.log("You are successful connected to database.");
    let cycle = () => {
        let oMenu = new Menu(oCollections),
            oDbApi = new DbApi(db, () => {
                process.nextTick(cycle);
            }),
            oChosenAction = oMenu.getUserChoice();

        if( oChosenAction != null ) {
            switch ( parseInt(oChosenAction.operation, 10) - 1 ) {
                case 0: //C
                    oDbApi.collectionInsert(oCollections[oChosenAction.collectionName]);
                    break;
                case 1: //R
                    oDbApi.collectionFind(oCollections[oChosenAction.collectionName]);
                    break;
                case 2: //U
                    oDbApi.collectionUpdate(oCollections[oChosenAction.collectionName]);
                    break;
                case 3: //D
                    oDbApi.collectionDelete(oCollections[oChosenAction.collectionName]);
                    break;
            }
        } else {
            db.close();
            process.exit();
        }
        // process.nextTick(cycle);
    };
    cycle();
});
