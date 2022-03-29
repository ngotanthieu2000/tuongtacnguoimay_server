const express = require('express')
const router=express.Router()
const AnimalsModel = require('../models/AnimalsModel.js');
router.get('/', async (req,res)=>{
    const animals = await AnimalsModel.find()
    if(!animals) res.status(404).json({Message:"Not found!"})
    res.status(404).json(animals)
})

module.exports = router;