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
                            'buy_amount':rows[row][3],
                            'sell_amount':rows[row][4],
                            'buy_date':rows[row][5],
                            'sell_date':rows[row][6]
                        });
                    }
                }
            });
        })
        return response
    },
    countTrade(){
        let response = 0;
        new Sqlite(database, function (err, db) {
            db.all("SELECT COUNT(*) FROM "+tblTradenote+" WHERE  `buy_amount` > 0 AND `sell_amount` > 0;", [], function (err, count) {
                if (err) {
                    response = false
                    console.log(err);
                }
                if(count > 0){
                    response = count;
                }
            });
        })
        return response
    },
    countWin: function(){
        let response = 0;
        new Sqlite(database, function (err, db) {
            db.all("SELECT COUNT(*) FROM "+tblTradenote+" WHERE  `buy_amount` < `sell_amount`;", [], function (err, count) {
                if (err) {
                    response = false
                    console.log(err);
                }
                if(count > 0){
                    response = count;
                }
            });
        })
        return response
    },
    countLose: function(){
        let response = 0;
        new Sqlite(database, function (err, db) {
            db.all("SELECT COUNT(*) FROM "+tblTradenote+" WHERE  `buy_amount` > `sell_amount`;", [], function (err, count) {
                if (err) {
                    response = false
                    console.log(err);
                }
                if(count > 0){
                    response = count;
                }
            });
        })
        return response
    }
}
export default model
