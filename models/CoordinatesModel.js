const mongoose = require('mongoose')
const {Schema} = mongoose;

const CoordinateSchema = new Schema({
    lat:{type:String , required:true},
    long:{type:String, required:true},
},{timestamps:true})
module.exports = mongoose.model('Coordinates',CoordinateSchema)