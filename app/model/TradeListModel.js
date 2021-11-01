const Sqlite = require("nativescript-sqlite")
import dbconf from "~/common/database.js"
const tblTradenote = dbconf.config().tblTradenote
const database = dbconf.config().database
const dbversion = dbconf.config().dbversion
const model = {
    //https://www.w3resource.com/sqlite/sqlite-strftime.php
 /*   testQuery: function(){
        let response = [];
        let sqlQuery = '';
        new Sqlite(database, function (err, db) {
            // sqlQuery = "SELECT `buy_date`,strftime('%Y/%m/%d',`buy_date`),strftime('%Y/%m/%d','now') FROM "+tblTradenote+" WHERE `coin` = 'VRA' ORDER BY `id` DESC;";
            //Last 7 days sqlQuery = "SELECT `buy_date` FROM "+tblTradenote+" WHERE `coin` = 'VRA' AND (`buy_date` BETWEEN strftime('%Y/%m/%d',(SELECT DATETIME('now', '-7 day'))) AND strftime('%Y/%m/%d','now')) ORDER BY `id` DESC;";
            sqlQuery = "SELECT`buy_date`, strftime('%Y-%m','2021-10-07') FROM "+tblTradenote+" WHERE `coin` = 'VRA' ORDER BY `id` DESC;";
            // AND strftime('%Y/%m',`buy_date`) = '2021/10'
            db.all(sqlQuery, [], function (err, rows) {
                    if (err) {
                        response = false
                        console.log(err);
                    }
                    if(rows.length > 0) {
                        for(var row in rows){
                            console.log('Date:'+rows[row][0]);
                            console.log('Formatted:'+rows[row][1]);
                            // console.log('Test query:'+rows[row][1]);
                            // console.log('DB Data:'+rows[row][0]);
                            // console.log('Formatted:'+rows[row][1]);
                            // console.log('Now Date:'+rows[row][2]);
                        }
                    }
            });
        })
        // console.log(response);
    },*/
    filterTrade: function(data){
        let response = [];
        let sqlQuery = '';
        let mydata = [];
        new Sqlite(database, function (err, db) {
            if(data.buySell== 'sell'){
                if(data.filterBy == 'year'){
                    sqlQuery = "SELECT * FROM "+tblTradenote+" WHERE `coin` = ? AND strftime('%Y',`sell_date`) = ? ORDER BY `id` DESC;";
                    mydata = [data.coin,data.dateSet];
                }
                if(data.filterBy == 'month'){
                    sqlQuery = "SELECT * FROM "+tblTradenote+" WHERE `coin` = ? AND strftime('%Y-%m',`sell_date`) = ? ORDER BY `id` DESC;";
                    mydata = [data.coin,data.dateSet];
                }
                if(data.filterBy =='7days'){
                    sqlQuery = "SELECT * FROM "+tblTradenote+" WHERE `coin` = ? AND (`sell_date` BETWEEN strftime('%Y-%m-%d',(SELECT DATETIME('now', '-7 day'))) AND strftime('%Y-%m-%d','now')) ORDER BY `id` DESC;";
                    mydata = [data.coin];
                }
                if(data.filterBy == 'today'){
                    sqlQuery = "SELECT * FROM "+tblTradenote+" WHERE `coin` = ? AND `sell_date` = strftime('%Y-%m-%d','now') ORDER BY `id` DESC;";
                    mydata = [data.coin];
                }
            }
            if(data.buySell == 'buy'){
                if(data.filterBy == 'year'){
                    sqlQuery = "SELECT * FROM "+tblTradenote+" WHERE `coin` = ? AND strftime('%Y',`buy_date`) = ? ORDER BY `id` DESC;";
                    mydata = [data.coin,data.dateSet];
                }
                if(data.filterBy == 'month'){
                    sqlQuery = "SELECT * FROM "+tblTradenote+" WHERE `coin` = ? AND strftime('%Y-%m',`buy_date`) = ? ORDER BY `id` DESC;";
                    mydata = [data.coin,data.dateSet];
                }
                if(data.filterBy =='7days'){
                    sqlQuery = "SELECT * FROM "+tblTradenote+" WHERE `coin` = ? AND (`buy_date` BETWEEN strftime('%Y-%m-%d',(SELECT DATETIME('now', '-7 day'))) AND strftime('%Y-%m-%d','now')) ORDER BY `id` DESC;";
                    mydata = [data.coin];
                }
                if(data.filterBy == 'today'){
                    sqlQuery = "SELECT * FROM "+tblTradenote+" WHERE `coin` = ? AND `buy_date` = strftime('%Y-%m-%d','now') ORDER BY `id` DESC;";
                    mydata = [data.coin];
                }
            }
            if(data.buySell==''){
                sqlQuery = "SELECT * FROM "+tblTradenote+" WHERE `coin` = ? ORDER BY `id` DESC;";
                mydata = [data.coin];
            }
            // [data.buySell,data.coin,data.filterBy]
            db.all(sqlQuery, mydata, function (err, rows) {
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
                                'buy_amount':Math.round(10000*rows[row][3])/10000,
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
