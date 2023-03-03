const dotenv = require("dotenv");
dotenv.config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Profile, VerifyCallback } = require("passport-google-oauth20");

const User = require('../db/User.cjs')


// console.log(process.env.CLIENT_ID)
// console.log(process.env.PORT)
passport.serializeUser(function(user, done) {
  // console.log("calling serializeUser", user)
  // console.log(user)
  done(null, user.id);
});

passport.deserializeUser(async (id, done) =>  {
  // console.log("calling deserializeUser",id)
 
  try {
    const user = await User.findById(id);
    if(!user) throw new Error("user not found")
      done(null, user)
    }catch (err) {
       console.log(err)
       done( null, err)
    }
  
  
});

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.REDIRECT_URL,
        scope: ["profile"],
      },
      async (accessToken,refreshToken,profile,done) => {
        // console.log(accessToken);
        // console.log(profile);
     

        const user = await User.findOne({ googleId: profile.id });
        if(user) {
         return done(null, user);
        }else {
          console.log("calling create user statement")
         const newUser = await User.create({
           googleId: profile.id,
           name: profile.displayName,
           lists: {
            home: ["eat", "sleep", "repeat"]
           }
         })
        //  console.log("new user", newUser)
         return done(null , newUser);
        }
        // done(null, { username: profile.displayName });
      }
      
      )
      );
      
      
    

