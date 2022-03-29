const express = require('express')
const router=express.Router()
const PhylumsModel = require('../models/PhylumsModel.js');

router.get('/', async (req,res)=>{
    const getPhylums = await PhylumsModel.find()
    if(!getPhylums) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getPhylums)
})

module.exports = router;