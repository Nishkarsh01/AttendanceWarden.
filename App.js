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

app.get('/sheet', function (req, res) {
  res.render('sheet', {
    dataArray: data,
  });
});

app.get('/:customSheetUid', function (req, res) {
  const customSheetUid = req.params.customSheetUid;
  var thatArray = [];
  thatArray = recordDataList.find((el) => el[0].uid === customSheetUid);
  res.render('recordSheet.ejs', {
    dataArray: thatArray,
  });
});

/***post requests */

app.post('/signup', function (req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var password = md5(req.body.password);

  if (username === '' || email === '' || password === '') {
    console.log('a field is empty');
  } else {
    users.push({ username: username, email: email, password: password });

    console.log('user has been created');
  }

  res.redirect('/');
});

app.post('/login', function (req, res) {
  var username = req.body.username;
  var password = md5(req.body.password);

  var loginUser = users.filter(
    (user) => user.username === username && user.password === user.password
  );

  reversedArray = [];

  for (var i = 0; i < recordDataList.length; i++) {
    reversedArray.push(recordDataList[recordDataList.length - i - 1]);
  }
  // [[],[],[{}, {}, {}...]]

  console.log(reversedArray);
  if (
    users.find(
      (user) => user.username === username && user.password === password
    )
  ) {
    res.render('dashboard', {
      recordArray: reversedArray.filter(
        (el) => el[0].thatUser === loginUser[0].username.replace(/\s/g, '')
      ),
      thatUser: loginUser,
    });
  } else {
    console.log(' user not found');
  }
});

/**dashboard newSheet post req */
app.post('/dashboard', function (req, res) {
  var title = req.body.sheetTitle;
  var className = req.body.className;
  var first = req.body.first;
  var last = req.body.last;
  var thatUser = req.body.thatUser;
  /*date*/
  ////-----------------------------------------------------------------------------
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let dateObj = new Date();
  let month = monthNames[dateObj.getMonth()];
  let day = String(dateObj.getDate()).padStart(2, '0');
  let year = dateObj.getFullYear();
  var todayDate = month + '\n' + day + ',' + year;

  ////------------------------------------------------------------------------------

  /*time*/
  ////-----------------------------------------------------------------------------
  var time = new Date();

  var theTime = time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  var uid = new Date().getTime().toString(36);
  ////------------------------------------------------------------------------------

  data = [];

  for (var i = first; i <= last; i++) {
    data.push({
      thatUser: thatUser.replace(/\s/g, ''),
      RollNo: '' + i,
      Attendance: 'Present',
      isPresent: true,
      url: 'img/check.png',
      titleInfo: title,
      classInfo: className,
      date: todayDate,
      theTime: theTime,
      uid: '' + uid,
    });
  }

  recordChanges.push(data);

  res.redirect('/sheet');
});

app.post('/change', function (req, res) {
  const checkedRollNo = req.body.checkbox;

  var thatStudent = data.find((student) => {
    if (student.RollNo === checkedRollNo) {
      if (student.isPresent) {
        //true
        return (
          (student.Attendance = 'Absent'),
          (student.isPresent = !student.isPresent),
          (student.url = 'img/remove.png')
        );
        //false
      } else {
        //false
        return (
          (student.Attendance = 'Present'),
          (student.isPresent = !student.isPresent),
          (student.url = 'img/check.png')
        );
        //true
      }
    }
  });

  res.redirect('/sheet');
});

app.post('/submitrecord', function (req, res) {
  recordData = data;
  recordDataList.push(recordData);

  res.redirect('/');
});

/****listen */

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}

app.listen(port, function () {
  console.log('Server started on port successfully');
});
