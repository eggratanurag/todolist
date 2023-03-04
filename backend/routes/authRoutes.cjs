const express = require("express");
// const asyncHandler = require("express-async-handler");
const User = require('../db/User.cjs')
const router = express.Router();
const passport = require('passport')


router.get('/google',
 passport.authenticate('google',["email", "profile"])
);
  
// router.get('/google/redirect',
//    passport.authenticate('google', {failureRedirect: "/login/failed"}), 
//    (req, res) => {
//     res.send(200)
//   });

  router.get('/login/failed', (req, res) => {
    res.statusCode(401).json({
      error:true,
      message:"login failed"
    })
  })
  router.get('/login/success', 
  async (req, res) => {
    console.log("calling req session statement",req.session)
    if(req.session.passport) {
      const user =  await User.findById(req.session.passport.user);
      // console.log(user)
   
      if(user) {
        res.status(200).json({
          user
        })
      }else {
        res.status(400);
        throw new Error("no user found");
      }
    }else {
   
     
      res.status(401).json("not logged in");
    }
  })


  router.get('/google/callback',
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect:"/login/failed",
  })
  )

  router.get('/logout', (req, res) => {
    console.log("user asking to logout")
    res.clearCookie('connect.sid', {path: '/'}).status(200).send('logged out');
  })

 
  module.exports = router;