var Sqlite = require("nativescript-sqlite");
var tblTradenote = "tblTradenote";
var tblPair = "tblPair";
var tblCoin = "tblCoin";
var database = "TradeNote.sqlite";
var dbversion = 1;
var DEBUGMODE = false;
var model = {

    copyDb: function(){
        if (!Sqlite.exists(database)) {
            Sqlite.copyDatabase(database);
            console.log("Successfully copied database");
        }
    },
    deleteDb: function () {
        if (DEBUGMODE && Sqlite.exists(database)) {
            Sqlite.deleteDatabase(database);
            console.log("Successfully deleted database");
        }
    },
    init: function () {
        new Sqlite(database, function (err, db) {
            console.log("Is a Sqlite Database: ", Sqlite.isSqlite(db) ? "Yes" : "No");
            db.version(function(err, ver) {
                console.log('Database version:' + ver);
                if (ver != dbversion) {
                    db.execSQL("CREATE TABLE android_metadata ( locale TEXT );"+
                    "INSERT INTO android_metadata values ('en_us');");
                    db.execSQL("CREATE TABLE IF NOT EXISTS `"+tblTradenote+"` (" +
                        "`id` INTEGER PRIMARY KEY AUTOINCREMENT," +
                        "`coin` TEXT," +
                        "`pair` TEXT," +
                        "`buy_amount` TEXT," +
                        "`sell_amount` TEXT," +
                        "`buy_date` TEXT," +
                        "`sell_date` TEXT);");
                    db.execSQL("CREATE TABLE IF NOT EXISTS `"+tblPair+"` (" +
                        "`id` INTEGER PRIMARY KEY AUTOINCREMENT," +
						"`pair` TEXT);");
                    db.execSQL("CREATE TABLE IF NOT EXISTS `"+tblCoin+"` (" +
                        "`id` INTEGER PRIMARY KEY AUTOINCREMENT," +
                        "`coin` TEXT," +
						"`status` INTEGER);");
                    if(err){
                        console.log('Database error: ' + err);
                    } else { 
                        console.log('Table successfully created'); 
                    }
                    db.version(1);
                }
            });
        })
    },
	config: function(){
		return {
			'tblTradenote':tblTradenote,
			'tblPair': tblPair,
			'tblCoin': tblCoin,
			'database': database,
			'dbversion': dbversion
		}	
	}
}
export default model
