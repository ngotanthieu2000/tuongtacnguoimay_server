const express = require('express')
const router=express.Router()
const RolesModel = require('../models/RolesModel.js');

router.get('/', async (req,res)=>{
    const getRoles = await RolesModel.find()
    if(!getRoles) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getRoles)
})

router.post('/create', async(req,res)=>{
    const createRoles = new RolesModel(req.body)
    if(createRoles) {
        console.log(createRoles)
        await createRoles.save()
        res.status(200).json({Message:"Successfully!"})
    }
    else res.status(403).json({Message:"Erorr, please try again"})
})

module.exports = router;