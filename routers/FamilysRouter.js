const express = require('express')
const router=express.Router()
const FamilysModel = require('../models/FamilysModel');

router.get('/', async (req,res)=>{
    const getFamily = await FamilysModel.find()
    if(!getFamily) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getFamily)
})

router.post('/create',async (req,res)=>{
    const createFamily = new FamilysModel(req.body)
    if(!createFamily) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(createFamily)
})

router.delete('/delete', async (req,res) =>{
    const deleteFamily = await FamilysModel.findByIdAndDelete({_id:req.body.id})
    if(!deleteFamily) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(deleteFamily)
})
module.exports = router;