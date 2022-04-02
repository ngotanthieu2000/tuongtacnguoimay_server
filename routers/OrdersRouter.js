const express = require('express')
const router=express.Router()
const OrdersModel = require('../models/OrdersModel.js');

router.get('/', async (req,res)=>{
    const getOrders = await OrdersModel.find()
    if(!getOrders) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getOrders)
})

router.post('/create',async (req,res)=>{
    try {
        const createOrders = new OrdersModel(req.body)
        if(!createOrders) res.status(403).json({Message:"Error, please try again"})
        await createOrders.save()
        res.status(200).json(createOrders)
    } catch (error) {
        res.status(400).json({Message:"Requests Invalid", Error:error})
    }
})

router.delete('/delete', async (req,res) =>{
    const deleteOrders = await OrdersModel.findByIdAndDelete({_id:req.body.id})
    if(!deleteOrders) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(deleteOrders)
})
//search orders by classname or ordername
router.get('/:slug',async (req,res)=>{
    try {
        // console.log(req.params.slug)
        const getOrder = await OrdersModel.aggregate([
            {
                $lookup:{
                    from:"classes",
                    foreignField:"_id",
                    localField:"class",
                    as:"class_doc"
                }
            }
            ,{
                $match:{
                    $or:[
                        {"ordersName":{$eq:req.params.slug }},
                        {"class_doc.className":{$eq:req.params.slug }}
                    ]
                }
            }
            ,{
                $group:{
                    _id:"$_id",
                    ordersName:{$first:"$ordersName"},
                    className:{$first:"$class_doc.className"}
                }
            }
        ])
        if(!getOrder) res.status(404).json({Message:"Not found!"})
        res.status(200).json(getOrder)
    } catch (error) {
        res.status(400).json({Message:"Requests Invalid", Error:error})
    }
})
module.exports = router;