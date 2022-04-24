const express = require('express')

const router=express.Router()
const RolesModel = require('../models/RolesModel.js');
const UsersModel = require('../models/UsersModel.js');
const validate = async (req,res,next)=>{
  if(!req.body.userId || req.body.userId === "") res.status(400).json("Do not have access")
  else{
    try {
      const user = await UsersModel.findOne({_id:req.body.userId}).populate('role')
      // res.status(200).json({id:user._id,roleName:user.role.roleName})
      if(user.role.roleName==='Author'){
        next();
      }
      else{
        res.status(400).json("Do not have access")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
}
const checkData = async (req,res,next) => {
  try {
    const existData = await RolesModel.findOne({roleName:req.body.roleName})
    if(existData) res.status(400).json("Data not valid")
    else{
      // console.log("Data valid")
       next()
      }
  } catch (error) {
    res.status(500).json(error)
  }
}

router.get('/', async (req,res)=>{
    const getRoles = await RolesModel.find()
    if(!getRoles) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getRoles)
})
// create role document
/*
    {
        "roleName":""
    }
*/
router.post('/create',validate,checkData,async(req,res)=>{
  console.log("Create")
    const createRoles = new RolesModel({roleName:req.body.roleName})
    if(createRoles) {
        console.log(createRoles)
        await createRoles.save()
        res.status(200).json({Message:"Successfully!",Role:createRoles})
    }
    else res.status(403).json({Message:"Erorr, please try again"})
})

module.exports = router;