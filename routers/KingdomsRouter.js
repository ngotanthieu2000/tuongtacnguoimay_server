const express = require('express')
const router=express.Router()
const KingdomsModel = require('../models/KingdomsModel.js');

router.get('/', async (req,res)=>{
    const getKingdoms = await KingdomsModel.find()
    if(!getKingdoms) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getKingdoms)
})

router.post('/create',async (req,res)=>{
    const createKingdoms = new KingdomsModel(req.body)
    if(!createKingdoms) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(createKingdoms)
})

router.delete('/delete', async (req,res) =>{
    const deleteKingdoms = await KingdomsModel.findByIdAndDelete({_id:req.body.id})
    if(!deleteKingdoms) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(deleteKingdoms)
})
module.exports = router;