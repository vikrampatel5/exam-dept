var express = require('express');
var con = require('./connection');
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');
var app = express();

app.get('/generate',function(req,res,next){
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
            sql = "Select ae.ps_name, ae.subject_code, s.nomenclature, e.department, e.address FROM alloted_examiners AS ae JOIN examiners AS e on ae.subject_code = e.Subject_Code JOIN subjects AS s ON ae.subject_code = s.Code";
            con.query(sql, (err, result, fields) => {
                if(err) return next(err);
                // console.log(result);
                for(var i=0; i< result.length; i++){
                    data = {
                        name: result[i].ps_name,
                        code: result[i].subject_code,
                        nomenclature: result[i].nomenclature,
                        dept: result[i].department,
                        address: result[i].address
                    }
                    generateLetter(data, i);
                }
                conn.release();
            });
        }
    });
   
    
});


function generateLetter(data, i){
        //Load the docx file as a binary
var content = fs
.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

var zip = new JSZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);

doc.setData(data);

try {
// render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
doc.render()
}
catch (error) {
var e = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    properties: error.properties,
}
console.log(JSON.stringify({error: e}));
// The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
throw error;
}

var buf = doc.getZip()
         .generate({type: 'nodebuffer'});

// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
fs.writeFileSync(path.resolve(__dirname, 'output_'+(i+1)+'.docx'), buf);

}
module.exports = app;