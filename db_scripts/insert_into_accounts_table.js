
const mysql = require("mysql2");
const bcrypt = require('bcrypt');

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

    const saltRounds = 10;
    const myPlaintextPassword = 'tango'; // replace with plaintext password chosen by you OR retain the same value
    const passwordHash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

    const rowToBeInserted = {
        acc_name: 'charlie',            // replace with acc_name chosen by you OR retain the same value
        acc_login: 'charlie',           // replace with acc_login chosen by you OR retain the same value
        acc_password: passwordHash      
    };

    console.log("Attempting to insert record into tbl_accounts");
    dbCon.query('INSERT tbl_accounts SET ?', rowToBeInserted, function (err, result) {
        if (err) {
            throw err;
        }
        console.log("Table record inserted!");
    });

    dbCon.end();
});
