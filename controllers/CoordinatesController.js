const CoordinatesModel = require('../models/CoordinatesModel.js')
const createCoordinates = async (req,res,next)=>{
    try {
        let data= req.body.coordinates
        let result = []
        console.log(req.body)
        if(!data) res.status(400).json("Request invalid")
        else{
            data.forEach(async (element) => {
                // let createCoordinates=  new CoordinatesModel({lat:element.lat,long:element.long})
                // result.push(createCoordinates)
                // await createCoordinates.save()
                console.log('Them thanh cong')
            })
        }
        
        req.body.coordinates = result
        res.status(200).json(result)
        // next()
    } catch (error) {
        res.status(500).json({Message:"Server Error", Error:error})
    }
}

module.exports ={
    createCoordinates
}