const Sqlite = require("nativescript-sqlite")
import dbconf from "~/common/database.js"
const tblTradenote = dbconf.config().tblTradenote
const database = dbconf.config().database
const dbversion = dbconf.config().dbversion
const model = {
    addTrade: function (data) {
        let response = true;
        new Sqlite(database, function (err, db) {
            db.execSQL("INSERT INTO `"+tblTradenote+"` (`coin`, `pair`,`buy_amount`,`sell_amount`,`buy_date`,`sell_date`) VALUES (?,?,?,?,?,?);", data, function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                }
            })
        })
        return response;
    },
    deleteTrade: function (data) {
        let response = true;
        new Sqlite(database, function (err, db) {
            db.execSQL("DELETE FROM "+tblTradenote+" WHERE `id` = ?", data, function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                }
            });
        })
        return response;
    },
    deleteTradeCoin: function (data) {
        let response = true;
        new Sqlite(database, function (err, db) {
            db.execSQL("DELETE FROM "+tblTradenote+" WHERE `coin` = ?", data, function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                }
            });
        })
        return response;
    },
	updateTrade: function(data){
        let response = true;
        new Sqlite(database, function (err, db) {
            db.execSQL("UPDATE `"+tblTradenote+"` SET `sell_amount` = ?, `sell_date` = ? WHERE `id` = ?;", data, function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                }
            })
        })
        return response;
    },
    listTrade: function (data) {
        let response = [];
        new Sqlite(database, function (err, db) {
            db.all("SELECT * FROM "+tblTradenote+" WHERE `coin` = ? ORDER BY `id` DESC LIMIT 10;", data, function (err, rows) {
                if (err) {
                    response = false
                    console.log(err);
                }
                if(rows.length > 0) {
                    for(var row in rows){
                        response.push({
                            'id':rows[row][0],
                            'coin':rows[row][1],
                            'pair':rows[row][2],
                            'buy_amount': Math.round(10000*rows[row][3])/10000,
                            'sell_amount':Math.round(10000*rows[row][4])/10000,
                            'buy_date':rows[row][5],
                            'sell_date':rows[row][6]
                        });
                    }
                }
            });
        })
        return response
    }
}
export default model
