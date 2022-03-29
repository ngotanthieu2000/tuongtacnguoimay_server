const mongoose = require('mongoose')
const {Schema} = mongoose;

const OrderSchema = new Schema({
    orderName:{type:String, required:true, unique:true},
},{timestamps:true})
module.exports = mongoose.model('Orders',OrderSchema)