const jwt = require('jsonwebtoken');
require("dotenv").config();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    name:{
        type: String, required:true
    },
    email:{
        type: String, required:true
    },
    phone:{
        type: Number, required:true
    },
    work:{
        type: String, required:true
    },
    img:{
        type: String,
    },
    img_url:{
        type: String,
    },
    password:{
        type: String, required:true
    },
    confirmPassword:{
        type: String, required:true
    },
    // tokens:[{
    //     token:{
    //         type:String,
    //         required : true 
    //     }
    // }]
})


userSchema.pre('save', async function(next){
    console.log("Hi from inside")
    if(this.isModified('password')){

        this.password = await bcrypt.hash(this.password , 12);
        this.confirmPassword= await bcrypt.hash(this.confirmPassword , 12)
        console.log("Hi from Bcrypt")
    }
    next();
})

userSchema.methods.addMessage = async function (name , email , phone , message) {
    try{
        this.messages = this.messages.concat({name , email, phone , message})
        await this.save()
        return this.messages;

    }
    catch(err){
        console.log(err)
    }
}


// userSchema.methods.generateAuthToken = async function (req, res) {
//         let token = jwt.sign({_id :this._id} ,process.env.SECRET_KEY)
//         console.log(token,"In Token")
//         await this.save();

//         return ({jwt: token});
//         };
   

const User = mongoose.model('Users', userSchema)

module.exports = User
