const express = require('express')
const router=express.Router()
const bcrypt = require("bcrypt")
const UsersModel = require('../models/UsersModel.js')
const fs = require('fs')
const multer = require('multer')
require('dotenv').config()
const {uploadFile, deleteFile , upload} = require('../models/UploadMode.js')
// var storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './images/user/avatar');
//   },
//   filename: function(req, file, cb) {
//     cb(null,file.originalname)
//   },
// });

// var upload = multer({ storage });

router.get('/', async (req,res)=>{
    // const getUsers = await UsersModel.find()
    // if(!getUsers) res.status(404).json({Message:"Not found!"})
    // res.status(404).json(getUsers)
})
// create user document
/*
{
  "username":"",
  "password":"",
  "email":"",
  "avatar":"",
  "role":""
}
*/
router.post('/register',upload.single('avatar'), async (req,res,next)=>{
  try {
    // console.log(req.file)
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    console.log(req.file.path)
    let user =  {
      fullname:req.body.fullname,
      password:req.body.password,
      email:req.body.email,
      phone:req.body.phone,
      role: req.body.role ? req.body.role : "6248717928be8d544f553229",
      avatar: await uploadFile(req.body.fullname.replace(/\s/g, ''),req.file.path,false)
    }
    // console.log(user)
    const createUser =  new UsersModel(user)
    // console.log(createUser)
    if(createUser) {
      await createUser.save()
      res.status(200).json({Message:"Successfully!",User:createUser})
    }
  } catch (error) {
    res.status(403).json({Message:"Erorr, please try again"})
  }
});

router.get('/login',async (req,res)=>{
  try {
    console.log(req.body)
    const findUser = await UsersModel.findOne({$or:[{email:req.body.email},{phone:req.body.phone}]})
    if(findUser){
      const match = await bcrypt.compare(req.body.password, findUser.password);
      if(match){
        var img = fs.readFileSync(`../images/user/avatar/${findUser.avatar}`);
        res.status(200)
        .json({userId:findUser._id})
        .end(img, 'binary')
      }
      else res.status(400).json("Make sure you have entered correct username/password")
    }
  } catch (error) {
    res.status(403).json(error)
  }
})


module.exports = router;