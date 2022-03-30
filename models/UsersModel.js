const mongoose = require('mongoose')
const {Schema} = mongoose;

const UserSchema = new Schema({
    fullname:{type:String},
    username:{type:String, required: true , unique:true},
    password:{type:String, require:true},
    phone:{type:String,require: true, unique:true},
    email:{type:String,require: true, unique:true},
    avatar:{type:String},
    role:{type:mongoose.Schema.Types.ObjectId, ref:"Roles"}
},{timestamps:true})
module.exports = mongoose.model('Users',UserSchema)