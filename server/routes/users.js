var express = require("express");
var users = express.Router();
var mysql = require("mysql");
var con = require("./connection");

users.post("/addClerk", (req, res, next) => {
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
            var data = {
                id : req.body.id,
                name : req.body.name,
                email : req.body.email,
                password : req.body.password
            }
            conn.query('Insert into users SET ?',data, function(error, results, fields){
                if (error) return next(error);
                conn.release();
                return res.send(req.body);
            });
        }
    });
    
});
users.get("/getUser", (req, res, next) => {
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
            data = {
                email: req.query.email,
                password: req.query.password
            }
            console.log(data);
            conn.query('Select * from users where SET ? ',data, function(error, results, fields){
                if (error) return next(error);
                conn.release();
                return res.send(results);
            });
        }
    });
    
});

module.exports = users;