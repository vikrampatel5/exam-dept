var express = require("express");
var users = express.Router();
var mysql = require("mysql");
var con = require("./connection");

users.post("/addClerk", (req, res, next) => {
    var data = {
        id : req.body.id,
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    }
    con.query('Insert into users SET ?',data, function(error, results, fields){
        if (error) return next(error);
        res.send(req.body);
    });
});

module.exports = users;