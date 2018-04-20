var express = require('express');
var con = require('./connection');
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');
var app = express();
var async = require('async');

noFileExists = 0;
var message = '';

app.get('/generate',function(req,res,next){
<<<<<<< HEAD
   
=======
>>>>>>> d3f6c1ed8450a4026c3d29ee840ff28daa6040d9
    con.getConnection(function(err,conn){
        if(err){
            return next(err);
        }
        else{
<<<<<<< HEAD
            // console.log(req.query.codes);
            sql = "Select ae.ps_name, ae.subject_code, s.nomenclature, e.department, e.address FROM alloted_examiners AS ae JOIN examiners AS e on ae.subject_code = e.Subject_Code JOIN subjects AS s ON ae.subject_code = s.Code and ae.subject_code IN (?)";
            con.query(sql, [req.query.codes], (err, result, fields) => {
                if(err) return res.send('Server Error');
                // console.log(result);


                async.forEach(result, function(item, callback){
                    data = {
                        name: item.ps_name,
                        code: item.subject_code,
                        nomenclature: item.nomenclature,
                        dept: item.department,
                        address: item.address
                    }
                    // console.log(data);
                    generateLetter(data);
                    console.log('file is processed');
                    callback();
                },
                function(err){
                    conn.release();
                    return res.send(200,{body:'Generating Proposal Letters, Please Check Output Directory'});
                }
            );
               
            });
        }
    });
=======
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
   
    
>>>>>>> d3f6c1ed8450a4026c3d29ee840ff28daa6040d9
});


function generateLetter(data, i){
        //Load the docx file as a binary
var content = fs.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

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
// console.log(JSON.stringify({error: e}));
// The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
message = e.message;
return;
}

var buf = doc.getZip().generate({type: 'nodebuffer'});
var filePath = path.resolve(__dirname+"/Output/", "Allotment_"+data.name+'.docx');
// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
fs.stat(filePath, function(err, stat) {
    if(err == null) {
        noFileExists++;
        console.log(noFileExists+" "+ filePath+ ' Exists');
    } else if(err.code == 'ENOENT') {
        // file does not exist
        fs.writeFileSync(filePath, buf);
    } else {
        message = 'Server Error';
        // console.log('Some other error: ', err.code);
    }
});
}
module.exports = app;