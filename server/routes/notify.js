var express = require("express");
var notify = express.Router();
var con = require("./connection");
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "vikrampatel5@gmail.com",
      pass: ""
    }
  });

notify.post("/send_mail", (req, res, next) => {
    // console.log('its here');
    var mailOptions = {
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text
    };
    //console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(err, response) {
      if (err) return next(err);
      res.send(response);
      });
  });

  module.exports = notify;
  