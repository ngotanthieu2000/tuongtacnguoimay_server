const express = require('express')
const router=express.Router()
const AnimalsModel = require('../models/AnimalsModel.js');
router.get('/', async (req,res)=>{
    const animals = await AnimalsModel.find()
    if(!animals) res.status(404).json({Message:"Not found!"})
    res.status(404).json(animals)
})

// create animal document
/*
{
    "scientificName":"",
    "vietnameseName":"",
    "commonName":"",
    "phylum":"",
    "class":"",
    "order":"",
    "family":"",
    "image":"",
    "morphologicalCharacterization":"",
    "ecologicalCharacteristics":"",
    "value":[""],
    "uicn":"",
    "redlist":"",
    "distribution":"",
    "coordinate":"",
    "specimen":"",
    "habitat":"",
    "place":"",
    "status":"",
    "specimenCollectionDate":"",
    "specimentCollector":""
}
*/

router.post('/create', async (req,res)=>{
    try {
      const createAnimal = new AnimalsModel(req.body)
      if(createAnimal) {
        // console.log(createAnimal)
        await createAnimal.save()
        res.status(200).json({Message:"Successfully!",Animal:createAnimal})
      }
    } catch (error) {
      res.status(403).json({Message:"Erorr, please try again"})
    }
  });
module.exports = router;