const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const PORT = 3000;
const router = require("./routers/index.js");
// const { create } = require("express-handlebars");
// const URL = 'mongodb://localhost:27017/forumsanimal';
// const URL = 'mongodb+srv://NienLuan:NienLuan@cluster0.u8igy.mongodb.net/forumsanimal?retryWrites=true&w=majority'

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);
// const hbs = create({
//   /* config */
// });

// app.engine("handlebars", hbs.engine);
// app.set("view engine", "handlebars");
// app.set("views", "./views");
// app.enable("view cache");

// app.get("/register", (req, res) => {
//   res.render("home", { layout: "register", template: "home-template" });
// });
// app.get("/updateProfile", (req, res) => {
//   res.render("home", { layout: "updateProfile", template: "home-template" });
// });
// app.get("/createAnimals", (req, res) => {
//     res.render("home", { layout: "createAnimals", template: "home-template" });
//   });
//   app.get("/updateAnimals", (req, res) => {
//     res.render("home", { layout: "updateAnimals", template: "home-template" });
//   });
mongoose
  .connect(process.env.DB_URI, {
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
