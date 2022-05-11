const fs = require("fs");
const path = require("path");
const { unlink } = require("fs/promises");
// const moment = require('moment');
const multer = require("multer");

function nonAccentVietnamese(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
}
function setNumber(){
  number =1;
}
var storage_users = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images/avatar"));
  },
  filename: function (req, file, cb) {
    let d = new Date();
    let moment =
      d.getDate() +
      "-" +
      (d.getMonth() + 1) +
      "-" +
      d.getFullYear() +
      "-" +
      d.getHours();
    cb(null, nonAccentVietnamese(req.body.fullname).replace(/\s/g,'')+moment+path.extname(file.originalname));
  },
});
var number = 1;
var storage_animals = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images/animals"));
  },
  filename: function (req, file, cb) {
    let d = new Date();
    let filename ;
    let moment =
      d.getDate() +
      "-" +
      (d.getMonth() + 1) +
      "-" +
      d.getFullYear() +
      "-" +
      d.getHours();
      if(file.fieldname =='relatedImages'){
        filename = nonAccentVietnamese(req.body.name).replace(/\s/g,'') + "-" +file.fieldname +"-" + number.toString();
        // console.log("RelatedImages:",number)
        number++;
      }
      else{
        filename =nonAccentVietnamese(req.body.name).replace(/\s/g,'')+"-"+ file.fieldname  ;
      }
    cb(null, filename +"-"+ moment+path.extname(file.originalname));
    // cb(null, file.originalname);
  },
});

var upload_user = multer({ storage: storage_users });
var upload_animal = multer({ storage: storage_animals });
module.exports = {
  setNumber,
  upload_user: upload_user,
  upload_animal:upload_animal,
  unlink
};
