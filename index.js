'use strict';
const express = require('express');
const bodyParser = require('body-parser');
var request = require("request");
var fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.get('/saludo',(req, res) =>{
    res.send({ message : 'Hola mundo!!'});
});
app.get('/saludo/:nombre',(req, res)=> {
    // obtener parametro
    const parametro = req.params.nombre;
    res.send({message : `Hola ${parametro}`});
});

// parametros api externa 
const options = {
    host: 'http://jsonplaceholder.typicode.com',
    port: 80,
    path: '/posts',
    method: 'GET'
}
app.get('/api-externa', (req, res) => {
    request('https://jsonplaceholder.typicode.com/users', function(error, response, body) {
        if(error) {
            res.send({message :error})
        }else {
            res.send({data : JSON.parse(body)})
        }
       
    });
});


var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
      
      request(uri).pipe(res);
    });
  }; 
  var savefile = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
      
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  }; 
app.get('/guardar', (req, res) => {

    savefile('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
        console.log('done');
      });
});
app.get('/pdf', (req, res) => {

      const uri = 'https://www.google.com/images/srpr/logo3w.png';
      request.head(uri, function(err, resp, body){
        console.log('content-type:', resp.headers['content-type']);
        console.log('content-length:', resp.headers['content-length']);
        
        request(uri).pipe(fs.createWriteStream('test-1.png')).on('close', function(){
          
            res.setHeader('Content-disposition', 'attachment; filename=google.png');
            res.setHeader('Content-type', 'application/png');
            //res.send(resp);
            res.download("./test-1.png");
        });;
      });

});
app.listen(port, () => {
    console.log(`API CORRIENDO EN EL PUERTO: ${port}`);
});