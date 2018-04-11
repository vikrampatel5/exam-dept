var express = require("express");
var examiners = express.Router();
var mysql = require("mysql");
var con = require("./connection");

function ObjToArray(obj) {
  var arr = obj instanceof Array;
  return (arr ? obj : Object.keys(obj)).map(function(i) {
    var val = arr ? i : obj[i];
    if(typeof val === 'object')
      return ObjToArray(val);
    else
      return val;
  });
}

examiners.post("/add_examiner", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      conn.query("INSERT INTO examiners SET ?", req.body, function(
        err,
        result,
        fields
      ) {
        if (err) {
          if(err.errno == 1452){
            return res.send({status:false,message:"Please Insert Valid Subject Code Or Add Subject Code First"});
          }
          return next(err)
        };
        conn.release();
        return res.send({status:true,message:"Examiner Inserted Succefully"});
      });
    }
  });
});


examiners.post("/upload_file", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      var data = ObjToArray(req.body);

  conn.query("INSERT INTO examiners( name, Subject_code, Department, Address) VALUES ?", [data], function(
    err,
    result
  ) {
    if (err){
      console.log(err);
      if(err.errno == 1452){
        return res.send({status: false, message:"Please Check Your File, All Subject Codes Should be Valid"})
      }
      if(err.errno = 1136){
        return res.send({status: false, message:"Column count doesn't match value count Or Null Value"});
      }
    }
   else{
    conn.release();
    return res.send({status: true, message:"File Uploaded Successfully"});
    }
  });
    }
  });
  
});



examiners.post("/update_examiner", (req, res, next) => {
  con.getConnection(function(err,conn){
    if(err){
      return next(err);
    }  
    else{
      var id = req.body.id;
  conn.query("UPDATE examiners SET ? where id = '"+id+"'", req.body, function(
    err,
    result,
    fields
  ) {
    if (err) return next(err);
    conn.release();
    return res.send(req.body);
  });
    }
  })
  
});


examiners.post("/contact_developers", (req, res, next) => {

      var mailOptions = {
        to: ['vikrampatel5@gmail.com'],
        subject: req.body.subject,
        text: req.body.text
      };
      //console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(err, response) {
        if (err) return next(err);
        conn.release();
        return res.send(response);
        });
});

examiners.get("/get_examiners_list", (req, res, next) => {
  con.getConnection(function(err, conn){
    if(err){
      return next(err);
    }
    else{
      conn.query("SELECT * FROM examiners", function(err, result, fields) {
        if (err) return next(err);
        conn.release();
        return res.send(result);
      });
    }
  });
 
});

examiners.delete("/delete_examiner/:id", (req, res, next) => {
  con.getConnection(function(err,conn){
    if(err){
      return next(err);
    }
    else{
      conn.query(
        "delete from examiners where id = ? ",
        req.params.id,
        (err, result) => {
          if(err) return next(err);
          conn.release();
          return res.send({status:true,data:result,message:"Examiner Deleted Successfully"});
        }
      );
    }
  });
 
});


examiners.delete("/delete_all", (req, res, next) => {
  con.getConnection(function(err,conn){
    if(err){
      conn.release();
      return res.send({status:false,message:"Error While Deleting"});
    }
    else{
      conn.query(
        "truncate examiners",
        req.params.id,
        (err, result) => {
          if(err) return next(err);
          conn.release();
          return res.send({status:true,data:result,message:"All Examiner Details Are Deleted Successfully"});
        }
      );
    }
  });
 
});

examiners.get('/get_internal_examiners/:code',(req, res, next)=>{
  con.getConnection(function(err,conn){
    if(err){
      return next(err);
    }
    else{
      conn.query('select name from examiners where type="internal" and Subject_Code=?',req.params.code, function(err, result, fields) {
        if (err) return next(err);
        conn.release();
        return res.send(result);
      });
    }
  });
});


examiners.get('/get_external_examiners/:code',(req, res, next)=>{
  con.getConnection(function(err,conn){
    if(err){
      return next(err);
    } 
    else{
      conn.query('select name from examiners where type="external" and Subject_Code=?',req.params.code, function(err, result, fields) {
        if (err) return next(err);
        conn.release();
        return res.send(result);
      });
    }
  });
  
});

module.exports = examiners;
