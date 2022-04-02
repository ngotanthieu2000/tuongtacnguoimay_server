const express = require('express')
const router=express.Router()
const ClassModel = require('../models/ClassModel.js');

router.get('/', async (req,res)=>{
    try {
        const getClass = await ClassModel.find().populate({path:'phylum', select:'phylumsName'})
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

router.get('/:slug',async (req,res)=>{
    try {
        // console.log(req.params.slug)
        const getClass = await ClassModel.aggregate([
            {
                $lookup:{
                    from:"phylums",
                    foreignField:"_id",
                    localField:"phylum",
                    as:"phylum_doc"
                }
            }
            ,{
                $match:{
                    $or:[
                        {"className":{$eq:req.params.slug}},
                        {"phylum_doc.phylumsName":{$eq:req.params.slug}}
                    ]
                }
            }
            ,{
                $group:{
                    _id:"$_id",
                    className:{$first:"$className"},
                    phylumsName:{$first:"$phylum_doc.phylumsName"}
                }
            }
        ])
        if(!getClass) res.status(404).json({Message:"Not found!"})
        res.status(200).json(getClass)
    } catch (error) {
        res.status(400).json({Message:"Requests Invalid", Error:error})
    }
})

module.exports = router;