const express = require('express')
const router=express.Router()
const ClassModel = require('../models/ClassModel.js');

router.get('/', async (req,res)=>{
    const getClass = await ClassModel.find()
    if(!getClass) res.status(404).json({Message:"Not found!"})
    res.status(200).json(getClass)
})

router.post('/create',async (req,res)=>{
    const createClass = new ClassModel(req.body)
    if(!createClass) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(createClass)
})

router.delete('/delete', async (req,res) =>{
    const deleteClass = await ClassModel.findByIdAndDelete({_id:req.body.id})
    if(!deleteClass) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(deleteClass)
})
module.exports = router;