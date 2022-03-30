const express = require('express')
const router=express.Router()
const OrdersModel = require('../models/OrdersModel.js');

router.get('/', async (req,res)=>{
    const getOrders = await OrdersModel.find()
    if(!getOrders) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getOrders)
})

router.post('/create',async (req,res)=>{
    const createOrders = new OrdersModel(req.body)
    if(!createOrders) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(createOrders)
})

router.delete('/delete', async (req,res) =>{
    const deleteOrders = await OrdersModel.findByIdAndDelete({_id:req.body.id})
    if(!deleteOrders) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(deleteOrders)
})
module.exports = router;