const mongoose = require('mongoose')
const {Schema} = mongoose;

const KingdomsSchema = new Schema({
    kingdomsName:{type:String, required:true, unique:true},
},{timestamps:true})
module.exports = mongoose.model('Kingdoms',KingdomsSchema)