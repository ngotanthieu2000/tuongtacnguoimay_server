const mongoose = require('mongoose')
const {Schema} = mongoose;

const CoordinateSchema = new Schema({
    lat:{type:String},
    long:{type:String},
},{timestamps:true})
module.exports = mongoose.model('Coordinates',CoordinateSchema)