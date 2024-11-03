const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt');

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail){
                throw new Error('Email is not valid')
            }
        }
    },   
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword){
                throw new Error('Password is not strong' + value)
            }
        }
    },
    age:{
        type:Number,
        min:18,

    },
    gender:{
        type:String,
        //custom validation function
        //this will not run - only runs when first doc created
        validate(value){
            if(!["male","female","others"].includes(value))
            {
              throw new Error("Gender Data Is not valid")  
            }
        }
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL){
                throw new Error('PhotoURL is not valid' + value)
            }
        }
    },
    about:{
        type:String,
        default:'This is default value'
    },
    skills:{
        type:[String,]
    }
},{timestamps:true,})
//creating a model
const User=mongoose.model('User',userSchema)

module.exports={User}

// 2type validation
// Users kya daal sakta hai and users kya update kr sakta hai
// validator humesha use kro bro
//DB level (restrict users) & API level (restrict users for typing malacious data)
//validator -> a package use to validate email etc
//Data sanitization each input of data
// for POST and PATCH
// nvr trust on req.body 

//DB level methods , when we want to run method one each new user
//whenever a new user sign in we want to create jwt token and also comparre password for each user
userSchema.methods.getJWT=async function()
{
    //we are concerrned about this user
    const user=this;

    const token=await jwt.sign({_id:user._id},'shhhhh', {
        expiresIn:"7d",
    });
    return token;
}
// we can also offload the bcrypt compare here also
userSchema.methods.validatePassword=async function(passwordInputByUser)
{
    const user=this;
    const passwordHash=user.password
    const isPasswordValid= await bcrypt.compare(passwordInputByUser,passwordHash)
   return isPasswordValid;
}