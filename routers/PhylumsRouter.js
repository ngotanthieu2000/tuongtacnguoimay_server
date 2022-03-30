const express = require('express')
const router=express.Router()
const PhylumsModel = require('../models/PhylumsModel.js');

router.get('/', async (req,res)=>{
    const getPhylums = await PhylumsModel.find()
    if(!getPhylums) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getPhylums)
})

router.post('/create',async (req,res)=>{
    const createPhylums = new PhylumsModel(req.body)
    if(!createPhylums) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(createPhylums)
})

router.delete('/delete', async (req,res) =>{
    const deletePhylums = await PhylumsModel.findByIdAndDelete({_id:req.body.id})
    if(!deletePhylums) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(deletePhylums)
})
module.exports = router;