var express = require("express");
var users = express.Router();
var mysql = require("mysql");
var con = require("./connection");

<<<<<<< HEAD
users.post('/addUser', (req, res, next) => {
=======
users.post("/addClerk", (req, res, next) => {
>>>>>>> d3f6c1ed8450a4026c3d29ee840ff28daa6040d9
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
<<<<<<< HEAD
            console.log(req.body);
=======
>>>>>>> d3f6c1ed8450a4026c3d29ee840ff28daa6040d9
            var data = {
                id : req.body.id,
                name : req.body.name,
                email : req.body.email,
<<<<<<< HEAD
                password : req.body.password,
                role : req.body.role
            }
            console.log(data);
            conn.query('Insert into users SET ?',data, function(error, results, fields){
                if (error) return next(error);
                conn.release();
                return res.send({message: 'Successfull Inserted!!'});
=======
                password : req.body.password
            }
            conn.query('Insert into users SET ?',data, function(error, results, fields){
                if (error) return next(error);
                conn.release();
                return res.send(req.body);
>>>>>>> d3f6c1ed8450a4026c3d29ee840ff28daa6040d9
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
            // console.log(data);
            conn.query('Select * from users where email="'+data.email+'" and password="'+ data.password+'"', function(error, results, fields){
                if (error) return next(error);
                conn.release();
                return res.send(results);
            });
        }
    });
});

users.get("/getAllUsers", (req, res, next) => {
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
            conn.query('Select * from users', function(error, results, fields){
                if (error) return next(error);
                // console.log(results)
                conn.release();
                return res.send(results);
            });
        }
    });
});

users.delete("/deleteUser/:id", (req, res, next) => {
    con.getConnection(function(err,conn){
      if(err){
        return next(err);
      }
      else{
        conn.query(
          "delete from users where id = ? ",
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

module.exports = users;