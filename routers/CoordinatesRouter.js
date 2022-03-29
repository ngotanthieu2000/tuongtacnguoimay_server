const express = require('express')
const router=express.Router()
const CoordinatesModel = require('../models/CoordinatesModel.js');

router.get('/', async (req,res)=>{
    const getCoordinates = await CoordinatesModel.find()
    if(!getCoordinates) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getCoordinates)
})

module.exports = router;