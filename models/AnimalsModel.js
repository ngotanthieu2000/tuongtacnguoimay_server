const mongoose = require('mongoose')
const {Schema} = mongoose;

const AnimalSchema = new Schema({
    name:{type:String},
    phylum:{type:mongoose.Schema.Types.ObjectId, ref:"Phylums"},
    class:{type:mongoose.Schema.Types.ObjectId, ref:"Class"},
    order:{type:mongoose.Schema.Types.ObjectId, ref:"Orders"},
    family:{type:mongoose.Schema.Types.ObjectId, ref:"Familys"},
    relatedImages:[{type:String}],
    morphological_features:[{type:String}],
    ecological_characteristics:{type:String},
    value:{type:String},
    uicn:{type:String},
    red_list:{type:String},
    ndcp:{type:String},
    cites:{type:String},
    distribute:{type:String},
    coordinates:{
        type: Array
    },
    specimen_status:{type:String},
    habitat:{type:String},
    place:{type:String},
    status:{type:String ,default: "Not approved yet"},
    avatar:{type:String},
    author_id:{type:mongoose.Schema.Types.ObjectId, ref:"Users"},
    cause:{type:String, default:""}
},{timestamps:true})
module.exports = mongoose.model('Animals',AnimalSchema)