const express = require("express")
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
const PORT = 3000
const router = require('./routers/index.js')
const { engine } = require('express-handlebars')
// const URL = 'mongodb://localhost:27017/forumsanimal';
// const URL = 'mongodb+srv://NienLuan:NienLuan@cluster0.u8igy.mongodb.net/forumsanimal?retryWrites=true&w=majority'

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(router)

app.engine('handlebars', engine({extname: '.hbs'}));
app.set('view engine', 'handlebars');
app.set('views', './views');

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology:true})
    .then(()=>{
        console.log("connect db success...");
        app.listen(PORT, ()=>{
            console.log(`Server is running on port = ${PORT}... `);
        })
    }).catch((err)=>{
        console.log(err);
    })




