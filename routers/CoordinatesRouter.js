const express = require('express')
const router=express.Router()
const CoordinatesModel = require('../models/CoordinatesModel.js');

router.get('/', async (req,res)=>{
    const getCoordinates = await CoordinatesModel.find()
    if(!getCoordinates) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getCoordinates)
})

// create document coordinates
/* body {
    "lat":"...",
    "long":""
}
*/
router.post('/create',async (req,res)=>{
    try {
        const createCoordinates = new CoordinatesModel(req.body)
        if(!createCoordinates) res.status(403).json({Message:"Error, please try again"})
        await createCoordinates.save()
    res.status(200).json(createCoordinates)
    } catch (error) {
        res.status(400).json({Message:"Requests Invalid", Error:error})
    }
})
// delete coordinates
/* body {
    "id":"..."
}
*/
router.delete('/delete', async (req,res) =>{
    const deleteCoordinates = await CoordinatesModel.findByIdAndDelete({_id:req.body.id})
    if(!deleteCoordinates) res.status(403).json({Message:"Error, please try again"})
    res.status(200).json(deleteCoordinates)
})
module.exports = router;