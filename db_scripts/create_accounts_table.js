
const mysql = require("mysql");


require('dotenv').config({path : '../.env'})
const dbCon = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,                      
    password: process.env.password, 
    database: process.env.database,                 
    port: process.env.port
});

console.log("Attempting database connection");
dbCon.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Connected to database!");

    const sql = `CREATE TABLE tbl_accounts (
        acc_id       INT NOT NULL AUTO_INCREMENT,
        acc_name     VARCHAR(20),
        acc_login    VARCHAR(20),
        acc_password VARCHAR(200),
        PRIMARY KEY (acc_id)
    )`;
    
    console.log("Attempting to create table: tbl_accounts");
    dbCon.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        console.log("Table tbl_accounts created");
    });

    dbCon.end();
});
