//requiring modules
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const md5 = require('md5');
const mongoose = require('mongoose');

//using express,etc.
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//users array
var users = [];

//empty data array
var data = [];

/**Array to Record All Data */
var recordData = [];
var recordDataList = [];
var reversedArray = [];
var recordChanges = [];

/***get requests*/
app.get('/', function (req, res) {
  res.render('index');
});

/****listen */

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}

app.listen(port, function () {
  console.log('Server started on port successfully');
});
