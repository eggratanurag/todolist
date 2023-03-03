const express = require("express");
const dotenv = require("dotenv");
require('./strategies/google.cjs')
const MongoStore = require('connect-mongo');
const connectDB = require("./db/config.cjs");
const cors = require("cors");
const colors = require("colors");
const path = require('path');
const Session = require('express-session')
const authRoutes = require("./routes/authRoutes.cjs");
const listRoutes = require("./routes/listRoutes.cjs");
const passport = require('passport');



const router = express.Router();

dotenv.config();
connectDB();

const app = express();
app.use(Session({
  secret: "anuragojha",
  resave: false,
  saveUninitialized: false,
  cookie : { secure : false, maxAge : (24 * 60 * 60 * 1000) },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  })
})
)
var corsOptions = {
  credentials: true,
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session())
app.use(express.json());

// console.log(process.env.CLIENT_ID)
// console.log(process.env.MONGO_URI)


app.use('/auth', authRoutes)
app.use('/list', listRoutes)

// const __dirname1 = path.resolve();
// if(process.env.NODE_ENV === 'production') {
//    app.use(express.static(path.join(__dirname1, "/frontend/build")));

//    app.get("*",(req,res)=> {
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
//    })
// }else {
 
   
// }

app.get("/", (req, res) => {
      res.send("api is performing fully well...");
    });


const PORT = process.env.PORT ;
app.listen(PORT, console.log(`your app is listening on localhost ${PORT}`.yellow.bold));
