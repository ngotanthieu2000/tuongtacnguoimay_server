const mongoose = require('mongoose')
const {Schema} = mongoose;

const ClassSchema = new Schema({
    className:{type:String, required:true, unique:true},
    phylum:{type:mongoose.Schema.Types.ObjectId, ref:"Phylums" , required: true }
},{timestamps:true})
module.exports = mongoose.model('Classes',ClassSchema)