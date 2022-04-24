const express = require('express')
const bodyParser = require('body-parser')
const router=express.Router()
const AnimalsModel = require('../models/AnimalsModel.js');
const UsersModel = require('../models/UsersModel.js');
const createCoordinates = require('./CoordinatesRouter.js')
const {uploadFile, deleteFile, upload} = require('../models/UploadMode.js')
const fs = require('fs')
const { unlink } = require('fs/promises')

const auth = async (req,res,next)=>{
  // console.log(req.body.specimentCollector)
  let userId
  if(req.params.slug ==="approved" || req.params.slug ==="reject" ){
    userId = req.body.editorId
  }
  else if(req.body.specimentCollector) 
  {
    userId=req.body.specimentCollector
  }
  else{
    userId = req.body.adminId
  }
  // console.log({userId})
    if(!userId || userId == null) res.status(400).json("Do not have access")
    try {
      const user = await UsersModel.findOne({_id:userId}).populate('role')
      // console.log({user})
      if(!user)  res.status(400).json("Do not have access")
      else if(req.params.slug && user.role.roleName ==='Editor')  next()
      else if(req.body.specimentCollector && user.role.roleName ==='Author') next()
      else if(req.body.adminId && user.role.roleName ==='Admin')  next()
      else res.status(400).json("Do not have access")
       
    } catch (error) {
      res.status(500).json(error)
  }
}

router.get('/:slug', async (req,res)=>{
   try {
    let phylum = req.params.slug
    console.log(phylum)
    const animals = await AnimalsModel.find({phylum:phylum}).select(['_id','avatar'])
    // const animals = await AnimalsModel.aggregate([
    //   {
    //     $lookup:{
    //       from:'phylums',
    //       localField:'phylum',
    //       foreignField:"_id",
    //       as:'phylum'
    //     }
    //   }
    // ])
    if(!animals) res.status(404).json({Message:"Not found!"})
    res.status(200).json(animals)
   } catch (error) {
     res.status(403).json(error)
   }
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
//upload.fields([{name:'avatar'},{name:'relevantImages'}])
router.post('/create',upload.fields([{name:'avatar'},{name:'relevantImages'}]),auth,async (req,res)=>{
  try {
    // console.log("Next success:",req.body.coordinates)
    // console.log(req.files)
    let animal={
      scientificName:req.body.scientificName,
      vietnameseName:req.body.vietnameseName,
      commonName:req.body.commonName,
      phylum:req.body.phylum,
      class:req.body.class,
      order:req.body.order,
      family:req.body.family,
      image:req.files['relevantImages'].map(a=>a.path),
      avatar: req.files['avatar'][0].path,
      morphologicalCharacterization: typeof(req.body.morphologicalCharacterization) === "string" ? JSON.parse(req.body.morphologicalCharacterization):morphologicalCharacterization,
      ecologicalCharacteristics:req.body.ecologicalCharacteristics,
      value:req.body.value,
      uicn:req.body.uicn,
      redlist:req.body.redlist,
      distribution:req.body.distribution,
      coordinates: typeof(req.body.coordinates) === "string" ? JSON.parse(req.body.coordinates):coordinates,
      specimen:req.body.specimen,
      habitat:req.body.habitat,
      place:req.body.place,
      specimenCollectionDate:req.body.specimenCollectionDate,
      specimentCollector:req.body.specimentCollector
    }
    // console.log(animal)
    const createAnimal = new AnimalsModel(animal)
    if(createAnimal) {
      // console.log(createAnimal)
      await createAnimal.save()
      res.status(200).json({Message:"Successfully!",Animal:createAnimal})
    }
  } catch (error) {
    res.status(403).json({Message:"Erorr, please try again"})
  }
});

router.put('/:slug',auth,async (req,res)=>{
  // console.log('Next success')
  try {
    if(req.params.slug === 'approved'){
      // console.log(req.body.animalId)
      const animals = await AnimalsModel.findById({_id:req.body.animalId})
      // console.log(animals)
      let avatar = await uploadFile(animals.scientificName.replace(/\s/g, ''),animals.avatar,true)
      // console.log(avatar)
      let image = animals.image.forEach(async (element) =>{
        // console.log('Upload to drive')
        await uploadFile(animals.scientificName.replace(/\s/g, ''),element,true)
      })
      const animalsUpdate = await AnimalsModel.findByIdAndUpdate({_id:req.body.animalId},{avatar,image,status:"Approved",cause:""},{new:true})
      await animalsUpdate.save()
      // console.log(animalsUpdate)
      res.status(200).json("Approved Successfully")
    }
    else if(req.params.slug ==='reject'){
      console.log('Reject')
      const animalsUpdate = await AnimalsModel.findByIdAndUpdate({_id:req.body.animalId},{cause:req.body.cause,status:"Reject"},{new:true})
      await animalsUpdate.save()
      res.status(200).json("Reject Successfully")
    }
  } catch (error) {
    res.status(403).json(error)
  }
})
module.exports = router;