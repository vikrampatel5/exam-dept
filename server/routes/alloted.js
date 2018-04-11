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
        if(err){
          return res.send({status:false, data:req.body, message:"Error While Alloting"});
        }
        conn.release();
        return res.send({status:true, data:result, message:"Examiner Alloted Successfully"});
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
      var data = {
        subject_code: req.body.subject_code,
        internal_examiner: req.body.internal_examiner,
        external_examiner: req.body.external_examiner,
        ps_name: req.body.ps_name,
        proposal: req.body.proposal,
        status: req.body.status
      }
      // console.log(req.body);
      conn.query("UPDATE alloted_examiners SET ? where subject_code = '"+sc+"'", data, function(
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
          if(err){
            conn.release();
            return res.send({status:false,message:"Error While Deleting"});
          }
          else{
            conn.release();
            return res.send({status:true, data:result, message:"Detail Deleted Successfully"});
          }
         
        }
      );
    }
  });
 
});


alloted.delete("/delete_all", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      conn.query(
        "truncate alloted_examiners",
        req.params.id,
        (err, result) => {
          if(err){
            conn.release();
            return res.send({status:false,message:"Error While Deleting"});
          }
          else{
            conn.release();
            return res.send({status:true, data:result, message:"All Alloted Details Deleted Successfully"});
          }
         
        }
      );
    }
  });
 
});



module.exports = alloted;
