const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UsersModel = require("../models/UsersModel.js");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();
const { uploadFile, deleteFile,getFile, upload } = require("../models/UploadMode.js");

const validData = async (req, res, next) => {
  try {
    let checkUser = await UsersModel.find({
      $or: [
        { email: { $eq: req.body.email } },
        { phone: { $eq: req.body.phone } },
      ],
    });
    if (checkUser.length > 0) res.status(400).json("Email or Phone exists");
    else next();
  } catch (error) {
    res.status(403).json(error);
  }
};
 
//get all user
router.get("/", async (req, res) => {
  const getUsers = await UsersModel.find();
  if (!getUsers) res.status(404).json({ Message: "Not found!" });
  res.status(404).json(getUsers);
});
// create user document
/*
{
  "username":"",
  "password":"",
  "email":"",
  "avatar":"",
  "role":""
}
*/
router.post(
  "/register",
  upload.single("avatar"),
  validData,
  async (req, res) => {
    try {
      // console.log(req.file)
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      console.log(typeof req.body.social_media);
      let user = {
        fullname: req.body.fullname,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        social_media:
          typeof req.body.social_media === "string"
            ? JSON.parse(req.body.social_media)
            : social_media,
        role: req.body.role ? req.body.role : "6248717928be8d544f553229",
        avatar: await uploadFile(
          req.body.fullname.replace(/\s/g, ""),
          req.file.path,
          false
        ),
      };
      // console.log(user)
      const createUser = new UsersModel(user);
      // console.log(createUser)
      if (createUser) {
        await createUser.save();
        res.status(200).json({ Message: "Successfully!", User: createUser });
      }
    } catch (error) {
      res.status(403).json(error);
    }
  }
);

router.get("/login", async (req, res) => {
  try {
    // console.log(req.body)
    let user;
    if(req.body.email){
      user = await UsersModel.findOne({email:req.body.email})
    }
    else if(req.body.phone){
      user = await UsersModel.findOne({email:req.body.phone})
    }
    else res.status(400).json("Please enter email or phone");
    
    // console.log(user)
    if(!user || user == null) res.status(400).json("Make sure you have entered correct email or phone number")
    else {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        // console.log('Mat khau oke')
        res.status(200).json(user);
      } else
        res
          .status(400)
          .json("Make sure you have entered correct password");
    }
  } catch (error) {
    res.status(403).json(error);
  }
});

router.put("/update", upload.fields([{ name: "avatar" }]), async (req, res) => {
  try {
    if (req.files["avatar"]) {
      console.log("Cap nhat avatar");
      const getUser = await UsersModel.findOne({ _id: req.body._id }).select([
        "avatar",
      ]);
      await deleteFile(getUser.avatar.slice(43, 500));
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    // console.log(typeof(req.body.social_media))
    let user = {
      fullname: req.body.fullname,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
      social_media:
        typeof req.body.social_media === "string"
          ? JSON.parse(req.body.social_media)
          : social_media,
      role: req.body.role ? req.body.role : "6248717928be8d544f553229",
      avatar: await uploadFile(
        req.body.fullname.replace(/\s/g, ""),
        req.files["avatar"][0].path,
        false
      ),
    };
    // console.log(user)
    const updateUser = await UsersModel.findOneAndUpdate(
      { _id: req.body._id },
       user 
    );
    await updateUser.save();
    // console.log(createUser)
      res.status(200).json({ Message: "Successfully!", User: updateUser });
  } catch (error) {
    res.status(403).json(error);
  }
});

module.exports = router;
