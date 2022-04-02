const mongoose = require('mongoose')
const {Schema} = mongoose;

const OrderSchema = new Schema({
    ordersName:{type:String, required:true, unique:true},
    class:{type:mongoose.Schema.Types.ObjectId, ref:"Classes", required:true}
},{timestamps:true})
module.exports = mongoose.model('Orders',OrderSchema)