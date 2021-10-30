const Sqlite = require("nativescript-sqlite")
import dbconf from "~/common/database.js"
const tblCoin = dbconf.config().tblCoin
const database = dbconf.config().database
const dbversion = dbconf.config().dbversion
const model = {
    addCoin: function (data) {
        let response = true;
        new Sqlite(database, function (err, db) {
            db.execSQL("INSERT INTO `"+tblCoin+"` (`coin`, `status`) VALUES (?,?);", data, function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                }
            })
        })
        return response;
    },
    deleteCoin: function (data) {
        let response = true;
        new Sqlite(database, function (err, db) {
            db.execSQL("DELETE FROM "+tblCoin+" WHERE `coin` = ?;", data, function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                }
            });
        })
        return response
    },
	setDefaultCoin: function(data){
        let response = true;
        new Sqlite(database, function (err, db) {
            db.execSQL("UPDATE `"+tblCoin+"` SET `status` = 0 WHERE `status` = 1;", [], function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                }
            })
            db.execSQL("UPDATE `"+tblCoin+"` SET `status` = 1 WHERE `coin` = ?;", data, function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                }
            })
        })
        return response;
    },
    listCoin: function () {
        let response = []
        new Sqlite(database, function (err, db) {
            db.all("SELECT * FROM `"+tblCoin+"`;", [], function (err, rows) {
                if (err) {
                    response = false
                    console.log(err);
                }
                if(rows.length > 0) {
                    for(var row in rows){
                        response.push({
                            'id':rows[row][0],
                            'coin':rows[row][1],
                            'status':rows[row][2]
                        });
                    }
                }
            });
        })
        return response
    },
    checkDefaultCoin: function(){
        let response = []
        new Sqlite(database, function (err, db) {
            db.all("SELECT `coin` FROM "+tblCoin+" WHERE `status` = 1;", [], function (err, rows) {
                if (err) {
                    response = false
                    console.log(err);
                }
                if(rows.length > 0) {
                    response = rows[0];
                }
            });
        })
        return response
    },
    checkCoin: function (data) {
        let response = false;
        new Sqlite(database, function (err, db) {
            db.all("SELECT `coin` FROM "+tblCoin+" WHERE `coin` = ?", data, function (err, rows) {
                if (err) {
                    response = false
                    console.log(err);
                }
                if(rows.length > 0) {
                    response = true;
                }
            });
        })
        return response
    }
}
export default model
