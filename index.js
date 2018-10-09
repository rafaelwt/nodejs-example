'use strict';
const express = require('express');
const bodyParser = require('body-parser');


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
app.listen(port, () => {
    console.log(`API CORRIENDO EN EL PUERTO: ${port}`);
});