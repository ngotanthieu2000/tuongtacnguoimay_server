const express = require('express')
const router=express.Router()
const OrdersModel = require('../models/OrdersModel.js');

router.get('/', async (req,res)=>{
    const getOrders = await OrdersModel.find()
    if(!getOrders) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getOrders)
})

module.exports = router;