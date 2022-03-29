const express = require('express')
const router=express.Router()
const FamilysModel = require('../models/FamilysModel');

router.get('/', async (req,res)=>{
    const getFamily = await FamilysModel.find()
    if(!getFamily) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getFamily)
})

module.exports = router;