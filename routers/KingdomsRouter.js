const express = require('express')
const router=express.Router()
const KingdomsModel = require('../models/KingdomsModel.js');

router.get('/', async (req,res)=>{
    const getKingdoms = await KingdomsModel.find()
    if(!getKingdoms) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getKingdoms)
})

module.exports = router;