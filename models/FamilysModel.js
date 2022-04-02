const mongoose = require('mongoose')
const {Schema} = mongoose;

const FamilySchema = new Schema({
    familysName:{type:String, required:true, unique:true},
    order:{type:mongoose.Schema.Types.ObjectId , ref:"Orders"}
},{timestamps:true})
module.exports = mongoose.model('Familys',FamilySchema)