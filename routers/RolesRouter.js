const express = require('express')
const router=express.Router()
const RolesModel = require('../models/RolesModel.js');

router.get('/', async (req,res)=>{
    const getRoles = await RolesModel.find()
    if(!getRoles) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getRoles)
})

module.exports = router;