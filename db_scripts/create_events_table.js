
var mysql = require("mysql2");


require('dotenv').config({path : '../.env'})
const dbCon = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,            
    password: process.env.db_password, 
    database: process.env.db_database,         
    port: process.env.db_port
});

dbCon.connect(function(err) {
  if (err) {
    throw err;
  };
  console.log("Connected!");
    var sql = `CREATE TABLE tbl_events(event_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         event_day VARCHAR(30),
                                         event_event VARCHAR(300),
                                         event_start VARCHAR(64),
                                         event_end VARCHAR(64),
                                         event_location VARCHAR(1024),
                                         event_phone VARCHAR(128),
                                         event_info VARCHAR(1024),
                                         event_url VARCHAR(1024))`;
  dbCon.query(sql, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Table created");
        dbCon.end();

  });
});
