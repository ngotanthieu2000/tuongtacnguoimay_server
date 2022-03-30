const express = require('express')
const router=express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dot = require('dotenv')
const UsersModel = require('../models/UsersModel.js');
const { $where } = require('../models/UsersModel.js')


const generateToken = (payload) =>{
    const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_LIFE});
    const refreshToken = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET); 

    return {accessToken, refreshToken};
}
//  verify
const verify =async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({Message:"You're not authenticated"})
    const token = authHeader.split(" ")[1];
    try {
        // const decode = jwt.verify(token.toString(),process.env.ACCESS_TOKEN_SECRET)
        // const user = await UserModel.findById({_id:decode.userId});
        // if(user.refreshToken === "") return res.status(401).json({Success:false, Message:"Please login to your account"})
        // req.user = user;
        // next();
        console.log("verify token: " + token);
        jwt.verify(token.toString(), "MPBA", (err, user) => {
          if(err)
            console.log(err);
          {
            req.user = user;
            next();
          }
        });
    } catch (error) {
        console.log(error);
        return res.status(403).json({Message:"Error, please try again",Error:error});        
    }
}
// Register <=> Create new user
const register =  async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      const newUser = new UsersModel({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        fullname: req.body.fullname,
        phone: req.body.phone,
        avatar: req.body.avatar,
        role: req.body.role,
      });
      newUser.save();
      res.status(200).json(newUser);
    } catch (err) {
      res.status(500).json(err);
    }
  };

const authRegister = async (req, res , next) =>{
    req.body.username = req.body.username.toLowerCase();
    const {username,email,phone} = req.body;
    try {
        // let checkList = [{username},{email},{phone}]
        // console.log("CheckList:",checkList);
        // checkList.forEach(element =>{
        //     console.log(`${Object.getOwnPropertyNames(element)}:${element[Object.getOwnPropertyNames(element)]}`)
        // })   
        const checkExist = await UsersModel.aggregate([
            {
                $match:{
                    $or:[
                        {"email":{$eq:[email]}}
                    ]
                }
            }
        ])
        if(typeof checkExist !== 'undefined' && checkExist.length > 0) {
            console.log(checkExist)
            res.status(403).json({Error:"User exist!"})
        }
        else{
            next();
        }
        // if(phoneExist) return res.status(403).json({Success:false, Message:"Your number phone has been exist"});
        // else if (!userExist && !phoneExist){
        //     const hashPassword = await agron2.hash(password);
        //     req.body.password = hashPassword;
        //     const user = new UserModel(req.body);
        //     await user.save();
        
        //     // return token
        //     const token = generateToken({user});
        //     //add refreshToken in database

        //     const addRefreshToken =  await UserModel.findOneAndUpdate({_id:user._id},{refreshToken:token.refreshToken});
        //     await addRefreshToken.save();
        //     res.status(200).json({Success:true,Message:"Register successfully",token});
        // }
        // else{
        //     res.status(403).json({Success:false, Message:"User already exist"});
        // }
    } catch (error) {
        res.status(500).json({Success:false, Error:error});
    }
}
// export const authLogin = async (req,res) =>{
//     try {
//         req.body.email = req.body.email.toLowerCase();
//         const {email,password} = req.body;
//         console.log("email and password:",req.body);
//         if(!email || !password){
//             res.status(400).json({Success:false, Message:"Enter your email and Password"});
//         }
//         else{
//             const user = await UserModel.findOne({email});
//             if(!user){
//                 res.status(400).json({Success:false, Message:"email or Password incorrect"})
//             }else{
//                 // console.log("email hop le!");
//                 // const passwordValid = await agron2.verify(user.password, password);
//                 const passwordValid = await bcrypt.compare(password, user.password);
//                 if(!passwordValid){
//                     res.status(400).json({Success:false, Message:"email or Password incorrect"})
//                 }
//                 else{
//                     // console.log("Password hop le!");
//                     // return token
                    
//                     const token = generateToken({userId:user._id, fullName:user.fullName , role:user.role});
//                     const addRefreshToken =  await UserModel.findOneAndUpdate({_id:user._id},{refreshToken:token.refreshToken});
//                     await addRefreshToken.save();
//                     res.status(200).json({Success:true,Message:"Login successfully",token});
//                 }
//             }
//         }
//     } catch (error) {
//         res.status(500).json({Success:false, Error:error ,Message:"Error occurred, please try again"});
//     }
// }
// export const authLogout =async (req,res) =>{
//     try {
//         const updateRefreshToken = await UserModel.findOneAndUpdate({_id:req.userId},{refreshToken:""},{new:true});
//         await updateRefreshToken.save();
//         if(updateRefreshToken) return res.status(200).json({Success:true, Message:"Logout successfully"});
//         return res.status(400).json({Success:false,Message:"User not found"});
//     } catch (error) {
//         res.status(500).json({Success:false,Message:"Error, please try again!", Error:error});
//     }
// }
// export const token = async (req,res) =>{
//     const refreshToken = req.body.refreshToken;
//     // console.log("RefreshToken:",refreshToken);
//     if(!refreshToken) return res.status(401).json({Success:false, Message:"Not found refresh token"});

//     const user = await UserModel.findOne({refreshToken});
//     if(!user) return res.status(403).json({Success:false, Message:"Not found user"});
//     try {
//         jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
//         const token = generateToken({user});
//         res.status(200).json({Success:true, Message:"Refresh Token successfully" ,Token:token});
//     } catch (error) {
//         res.status(500).json({Success:false,Message:"Error, please try again!", Error:error});
//     }
// }

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, "MPBA", {
    expiresIn: "1000s",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, "MA");
};

let listRefreshToken = [];

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email }).populate("role");
    await bcrypt.compare(password, user.password);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    listRefreshToken.push(refreshToken);

    res.status(200).json({
      id: user._id,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

// Refresh Tokens
const refresh =(req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(400).json("You're not authenticated");
  } else if (!listRefreshToken.includes(refreshToken)) {
    return res.status(400).json("Refresh token is invalid");
  }

  jwt.verify(refreshToken, "MA", (err, user) => {
    err && console.log(err);
    listRefreshToken = listRefreshToken.filter(
      (token) => token !== refreshToken
    );

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    listRefreshToken.push(newRefreshToken);
    console.log(
      "newAccessToken : " +
        newAccessToken +
        " - refreshToken: " +
        newRefreshToken
    );
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};

// Logout
const logout =  (req, res) => {
  const refreshToken = req.body.token;
  listRefreshToken = listRefreshToken.filter((token) => token !== refreshToken);
  res.status(200).json({Success:true,UserInfo:req.user,Message:"Log out! successfuly!"});
};

router.get('/', async (req,res)=>{
    const getUsers = await UsersModel.find()
    if(!getUsers) res.status(404).json({Message:"Not found!"})
    res.status(404).json(getUsers)
})

router.post('/register',authRegister,register);


module.exports = router;