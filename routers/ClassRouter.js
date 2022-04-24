const express = require('express')
const router=express.Router()
const ClassModel = require('../models/ClassModel.js');

router.get('/', async (req,res)=>{
    try {
        const getClass = await ClassModel.find({phylum:req.body.id ? req.body.id:""}).select(['_id','className'])
        if(!getClass) res.status(404).json({Message:"Not found!"})
        res.status(200).json(getClass)
    } catch (error) {
        res.status(400).json({Message:"Requests Invalid", Error:error})
    }
})
router.get('/:slug',async (req,res)=>{
    try {
        // console.log(req.params.slug)
        const getClass = await ClassModel.find({phulum:req.params.slug ? req.params.slug:""}).select(['_id','className'])
        if(!getClass) res.status(404).json({Message:"Not found!"})
        res.status(200).json(getClass)
    } catch (error) {
        res.status(400).json({Message:"Requests Invalid", Error:error})
    }
})

router.post('/create',async (req,res)=>{
    try {
        // console.log(req.body)
        const createClass = new ClassModel(req.body)
        if(!createClass) res.status(403).json({Message:"Error, please try again"})
        await createClass.save(function (err){
            if(err) return res.status(400).json({Message:"Requests Invalid", Error:err})
            else return res.status(201).json(createClass)
        })
    } catch (error) {
        res.status(400).json({Message:"Requests Invalid", Error:error})
    }
})

router.delete('/delete', async (req,res) =>{
    try {
        const deleteClass = await ClassModel.findByIdAndDelete({_id:req.body.id})
        if(!deleteClass) res.status(403).json({Message:"Error, please try again"})
        res.status(200).json({Message:"Successfully!"})
    } catch (error) {
        res.status(400).json({Message:"Requests Invalid", Error:error})
    }
})



module.exports = router;