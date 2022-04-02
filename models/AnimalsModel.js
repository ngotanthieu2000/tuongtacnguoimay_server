const mongoose = require('mongoose')
const {Schema} = mongoose;

const AnimalSchema = new Schema({
    scientificName:{type:String},
    vietnameseName:{type:String},
    commonName:{type:String},
    phylum:{type:mongoose.Schema.Types.ObjectId, ref:"Phylums"},
    class:{type:mongoose.Schema.Types.ObjectId, ref:"Class"},
    order:{type:mongoose.Schema.Types.ObjectId, ref:"Orders"},
    family:{type:mongoose.Schema.Types.ObjectId, ref:"Familys"},
    image:[{type:String}],
    morphologicalCharacterization:{type:String},
    ecologicalCharacteristics:{type:String},
    value:{type:String},
    uicn:{type:String},
    redlist:{type:String},
    distribution:{type:String},
    coordinate:[{type:mongoose.Schema.Types.ObjectId, ref:"Coordinates"}],
    specimen:{type:String},
    habitat:{type:String},
    place:{type:String},
    status:{type:String ,default: "Not approved yet"},
    specimenCollectionDate:{type:Date},
    specimentCollector:{type:mongoose.Schema.Types.ObjectId, ref:"Users"}
},{timestamps:true})
module.exports = mongoose.model('Animals',AnimalSchema)