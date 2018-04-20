var express = require("express");
var notify = express.Router();
var con = require("./connection");
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "vikrampatel5@gmail.com",
      pass: "076422025845"
    }
  });




notify.post("/send_mail", (req, res, next) => {
<<<<<<< HEAD
    // console.log(req.body);
=======
    // console.log('its here');
>>>>>>> d3f6c1ed8450a4026c3d29ee840ff28daa6040d9
    var mailOptions = {
      to: req.body.to,
      subject: req.body.subject,
      html: req.body.html
    };
    // console.log(mailOptions);
    

      smtpTransport.sendMail(mailOptions, function(err, response) {
        if (err) {
          return res.send({status: false, message: "Got Error While Sending mail"});
        }
        else{
          return res.send({status: true, data: response, message: "Mail Successfully Sent"});
        }
        });
    
    });
  

  module.exports = notify;
  