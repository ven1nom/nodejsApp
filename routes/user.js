const express=require('express');
const { userAuth } = require('../middlewares/userAuth');
const userRouter=express.Router();
const {userAuth}=require("../middlewares/userAuth");
const ConnectionRequest = require('../model/connectionRequest');
const User=require('../model/user')


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
//query params => feed?page=1&limit=10 pass in postman
userRouter.get('/user/feed', userAuth, async (req,res)=>{
    //User shouldnt see card of someone
    //whom -> sent or recieved request
    // User shouuldnt see his card himself    
  
   //Our DB for new user will showcase all user
   //But we need , only few users 
  const page=parseInt(req.query.page) || 1;
  const limit=parseInt(req.query.limit)  || 10;
  //sanitization on query param
  limit=limit>50?50:limit;
  
  // assume page number is one
  //skip page number formula
  const skip=(page-1)*limit;


    const loggedInUser=req.user;
    try{
      
      // either loggedInUser has sent or accepted connection request we will see them as toUser or fromUser
     // first access all such request then do "negative" operation
      const connectionRequests=await ConnectionRequest.find({
        $or:[{
            fromUserId:loggedInUser._id
        },{toUserId:loggedInUser._id}]

     }).select("fromUserId toUserId")
     //"select"=> we only want from and to from this   

     //block this users
     // we want to handle duplicate
     const hideUsersFromFeed=new Set();
     connectionRequests.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId.toString())
        hideUsersFromFeed.add(req.toUserId.toString())
    }) 

    console.log(hideUsersFromFeed);
    // these are 4 people I wish to hide from feed
     
    //Wish to send all users except hideUsers
    const users=await User.find({
        $and:[
      {_id:{$nin: Array.from(hideUsersFromFeed)}
    },
    {_id:{$ne:loggedInUser._id}},]   
    }).select("firstName","lastName","photoUrl","age","about","skills","gender").skip(skip).limit(limit);
    res.send(users)
     
     //Shouldnt send to himself -> toUserId != fromUserdId and vice-versa
    }catch(err){
        res.status(400).send("Unable to load feed")
    }
})

module.exports={userRouter};
//pagination & query params
// query params && mongoDB
// /feed?page=1&limit=10-> 1-10  ===> .skip(0) & .limit(10)
// /feed?page=2&limit=10=>11-20  ===> .skip(10) & .limit(10)

//.skip(0) & .limit(10)
// first 10 users - skipping 0 users and limit 10 users
