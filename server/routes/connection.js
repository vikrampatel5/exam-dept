var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "examdept"
});

con.connect(function(err) {  
    if (err) {
        console.log("Error Connecting to Database");
        return
    }   
    else {
        console.log("Connected!"); 
    }
  });  

  module.exports = con;