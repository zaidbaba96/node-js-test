
const express = require('express');
const app= express();
require("dotenv").config();
const upload = require("./middleware/upload")

const port = process.env.PORT || 4000;
const cors = require('cors')
const auth = require('./router/auth')
app.use(express.json())
const cookieParser = require("cookie-parser")

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.use('/api/auth', auth) 
//app.use(cors({credentials: true, origin: 'https://mern-front-end.herokuapp.com'}));

const User = require('./models/userSchema')
const bodyParser = require("body-parser");

const mongoose = require('mongoose')


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
  


app.use(require('./router/auth'));
mongoose
  .connect(
    "mongodb+srv://zaidbaba:zaidbaba@cluster0.knqp5.mongodb.net/mern_profile?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      retryWrites: false,
      bufferCommands: true
    }
  )
  .then(() => {
    console.log("MongoDB connected .....");
  })
  .catch(err => {
    console.log(err);
  });



app.get('/', (req,res)=>{
  console.log("Hello My About")
  res.send("Hello World From Server")
})

app.post("/updateProfile",upload.single('img'),async function(req, res) {
  console.log(req.body.email , "Hiii")
  console.log(req.file.path , "hello")
  // console.log("req.file", req.file);
  User.findOne({email: req.body.email}).exec((err, user) => {
    if(err) throw err;

    if(!user) {
      res.status(404).json({message: "User not found"})
    } else {
      user.img = req.file.filename;
      user.img_url = req.file.path;
      user.save((err) => {
        if(err) {
          console.log(err);
        } else {
          res.status(200).json({data: user, message: "update successfully !!!"})
        }
      })
    }
  })
})

app.listen(port, (req , res)=>{

    console.log("Server Listen At 4000");

})
