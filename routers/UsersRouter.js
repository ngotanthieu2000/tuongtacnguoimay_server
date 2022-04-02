const express = require('express')
const router=express.Router()
const bcrypt = require("bcrypt")
const UsersModel = require('../models/UsersModel.js');

router.get('/', async (req,res)=>{
    const getUsers = await UsersModel.find()
    if(!getUsers) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getUsers)
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
router.post('/register', async (req,res)=>{
  try {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const createUser = new UsersModel(req.body)
    if(createUser) {
      console.log(createUser)
      await createUser.save()
      res.status(200).json({Message:"Successfully!",User:createUser})
    }
  } catch (error) {
    res.status(403).json({Message:"Erorr, please try again"})
  }
});


module.exports = router;