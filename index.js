const express = require("express")
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000
const router = require('./routers/index.js')
// const URI = 'mongodb://localhost:27017/forumsanimal';
const URI = 'mongodb+srv://NienLuan:NienLuan@cluster0.u8igy.mongodb.net/forumsanimal?retryWrites=true&w=majority'

app.use(express.json())
app.use(router);

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology:true})
    .then(()=>{
        console.log("connect db success...");
        app.listen(PORT, ()=>{
            console.log(`Server is running on port = ${PORT}... `);
        })
    }).catch((err)=>{
        console.log(err);
    })