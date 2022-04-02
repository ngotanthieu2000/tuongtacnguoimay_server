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
    await createPhylums.save()  
    res.status(200).json(createPhylums)
})

router.delete('/delete', async (req,res) =>{
    const deletePhylums = await PhylumsModel.findByIdAndDelete({_id:req.body.id})
    if(!deletePhylums) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(deletePhylums)
})
//search phylums by phylums 
router.get('/:slug',async (req,res)=>{
    try {
        // console.log(req.params.slug)
        const getPhylums = await PhylumsModel.find({phylumsName:{$eq:req.params.slug }})
        if(!getPhylums) res.status(404).json({Message:"Not found!"})
        res.status(200).json(getPhylums)
    } catch (error) {
        res.status(400).json({Message:"Requests Invalid", Error:error})
    }
})
module.exports = router;