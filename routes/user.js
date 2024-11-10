const express=require('express');
const { userAuth } = require('../middlewares/userAuth');
const userRouter=express.Router();
const {userAuth}=require("../middlewares/userAuth");
const ConnectionRequest = require('../model/connectionRequest');
//APIs
//ALL connection for login User
// GET all pending connection for login User 
userRouter.get('/user/requests/recieved',userAuth,async (req,res)=>{
    const loggedInUser=req.body;
    try{
        // always be critical while doing .findOne vs .find (returns an array of elements)
       const connectionRequests= await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"
        // we only want people data who accepted my requesst
       })

    }catch(err){
     res.status(400).send("ERR"+ err.message)   
    }
})

module.exports={userRouter};