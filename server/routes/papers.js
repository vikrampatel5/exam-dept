var express = require("express");
var users = express.Router();
var mysql = require("mysql");
var con = require("./connection");

users.post("/updateStatus", (req, res, next) => {
    con.getConnection(function(err, conn){
        if(err){
            return next(err);
        }
        else{
            conn.query('Insert into paper_status SET ?',req.body, function(error, results, fields){
                if (error) return next(error);
                conn.release();
                return res.send(req.body);
            });
        }
    });
    
});

users.get("/getStatus", (req, res, next) => {
    con.getConnection(function(err, conn){
        if(err){
            return next(err);
        }
        else{
            conn.query('Select * from paper_status', function(error, results, fields){
                if (error) return next(error);
                conn.release();
                return res.send(results);
            });
        }
    });
    
});

module.exports = users;