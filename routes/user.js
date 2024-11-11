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
        //DB level Validation -> loggedIn user DB mein hona chahiye & status uska interested hona chahiye
        // always be critical while doing .findOne vs .find (returns an array of elements)
       const connectionRequests= await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"
        // we only want people data who showed interest in me "they are FromUserId"
       }).populate("fromUserId",["firstName","lastName","photoUrl","age","about","skills","gender"])// populate the data of toUserId ,with given status along with there firstName and LastName who sent me request but thats in User collection , so we make connection link using "ref"
// I also want to access the people name etc who has sent me connection request 
// for that I  have to map over connectionRequests obj and get the data of fromUserId
//OR
//Use "ref" to join2 tables ( build a relation between connectionRequest and User DB collection)
// make fromUserId in connectionReq as ref to user collection


    }catch(err){
     res.status(400).send("ERR"+ err.message)   
    }
})

//GET
//List of connections of people
userRouter.get('/user/connections',userAuth,async (req,res)=>{
    try{
        //A)all extraction
        const loggedInUser=req.user;
        //B) What to Fetch
        // Aisa data jaha logeedIn user to mein hoo aur status "Accepted ho"
        const connectionRequests=await ConnectionRequest.find({
        $or:[
            {toUserId:loggedInUser._id,status:"accepted"},
            {fromUserId:loggedInUser._id,status:"accepted"}
        ]
        }).populate("fromUserId",["firstName","lastName","photoUrl","age","about","skills","gender"]).populate("toUserId",["firstName","lastName","photoUrl","age","about","skills","gender"] )
    
    //modify data , we just want info about fromUserId
    const data=connectionRequests((row)=>{
         if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
            return row.toUserId;
         }
         return row.fromUserId;
    }
        
         )

    res.json({data});
    }catch(err){
        res.status(400).send({message:err.message})
    }
})
module.exports={userRouter};