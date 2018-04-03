var express = require("express");
var subjects = express.Router();
var mysql = require("mysql");
var con = require("./connection");

subjects.post("/add_subject", (req, res, next) => {
    console.log(req.body);
    con.query("INSERT INTO subjects SET ?", req.body, function(
      err,
      result,
      fields
    ) {
      if (err) return next(err);
      res.send(req.body);
    });
  });

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

  subjects.post("/upload_file", (req, res, next) => {
    //console.log(req.body);
    //var values = req.body;
    var data = ObjToArray(req.body);
    //var data = [];

    // console.log(data);
    con.query("INSERT INTO subjects (Code, Nomenclature, group_id) VALUES ?", [data], function(
      err,
      result
    ) {
      if (err) return next(err);
      res.send(req.body);
    });
  });

subjects.get("/get_subjects", (req, res, next) => {
    con.query("SELECT * FROM subjects", function(err, result, fields) {
      if (err) return next(err);
      return res.send(result);
    });
  });
  
  subjects.delete("/delete_subject/:code", (req, res, next) => {
    console.log(req.params.code);
    con.query(
      "delete from subjects where Code = ? ",
      req.params.code,
      (err, result) => {
        if (err) return next(err);
        return res.send(result);
      }
    );
  });


module.exports = subjects;
