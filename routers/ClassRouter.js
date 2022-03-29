const express = require('express')
const router=express.Router()
const ClassModel = require('../models/ClassModel.js');

router.get('/', async (req,res)=>{
    const getClass = await ClassModel.find()
    if(!getClass) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getClass)
})

module.exports = router;