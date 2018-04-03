var express = require("express");
var alloted = express.Router();
var mysql = require("mysql");
var nodemailer = require("nodemailer");
var con = require("./connection");


alloted.post("/add_alloted", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }else{
      conn.query("INSERT INTO alloted_examiners SET ?", req.body, function(
        err,
        result,
        fields
      ) {
        if(err) return next(err);
        conn.release();
        return res.send(req.body);
        
      });
    }
  })
  
});

alloted.post("/update_alloted", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      var sc = req.body.subject_code;
      console.log(req.body);
      conn.query("UPDATE alloted_examiners SET ? where subject_code = '"+sc+"'", req.body, function(
        err,
        result,
        fields
      ) {
        if(err) return next(err);
        conn.release();
        return res.send(req.body);
        
      });
    }
  });
 
});


alloted.get("/get_alloted_list", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      conn.query("SELECT * FROM alloted_examiners", function(err, result, fields) {
        if(err) return next(err);
        conn.release();
        return res.send(result);
        
      });
    }
  });
});

alloted.delete("/delete_alloted/:id", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      conn.query(
        "delete from alloted_examiners where subject_code = ? ",
        req.params.id,
        (err, result) => {
          if(err) return next(err);
          conn.release();
          return res.send(result);
         
        }
      );
    }
  });
 
});

module.exports = alloted;
