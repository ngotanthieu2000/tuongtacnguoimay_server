const mongoose = require('mongoose')
const {Schema} = mongoose;

const PhylumSchema = new Schema({
    phylumsName:{type:String, required:true, unique:true},
},{timestamps:true})
module.exports = mongoose.model('Phylums',PhylumSchema)