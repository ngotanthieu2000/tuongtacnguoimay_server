const express = require("express");
const multer = require('multer');
const upload = multer();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const PORT = 3000;
const router = require("./routers/index.js");
const { create } = require("express-handlebars");
const URL = 'mongodb://localhost:27017/forumsanimal';
// const URL = 'mongodb+srv://NienLuan:NienLuan@cluster0.u8igy.mongodb.net/forumsanimal?retryWrites=true&w=majority'

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);

const hbs = create({
  // config
});

app.use('/static', express.static('images'))

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");
app.enable("view cache");

app.get("/register", (req, res) => {
  res.render("home", { layout: "register", template: "home-template" });
});
app.get("/updateProfile", (req, res) => {
  res.render("home", { layout: "updateProfile", template: "home-template" });
});
app.get("/createAnimals", (req, res) => {
    res.render("home", { layout: "createAnimals", template: "home-template" });
  });
app.get("/updateAnimals", (req, res) => {
  res.render("home", { layout: "updateAnimals", template: "home-template" });
});
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect db success...");
    app.listen(PORT, () => {
      console.log(`Server is running on port = ${PORT}... `);
    });
  })
  .catch((err) => {
    console.log(err);
  });
