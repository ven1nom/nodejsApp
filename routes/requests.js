const express=require('express')

const requestRouter=express.Router();
const {userAuth}=require('../middlewares/userAuth');
const ConnectionRequest = require('../model/connectionRequest');
const User=require('../model/user')

//sendConnection request API
requestRouter.post('/request/send/:status/:toUserId',userAuth,async (req,res)=>{
    //read the user
    // const user=req.user;
    // res.send(user.firstName + " Connection request sent!!!")
    try{
      //this is logged in user 
      // as we are getting from userAuth
     const fromUserId= req.user._id;
     const toUserId= req.params.toUserId;
     const status= req.params.status;

     //sanitization for upcoming request 
     // we just want 2 , ignored or interested
     const allowedStatus=["ignored","interested"]
     if(!allowedStatus.includes(status)){
      return res.status(400).json({message:'Invalid status value'+ status})
     }
 
     // ValidationCheck - fromUserId and toUserId shouldnt be same
     //schema - pre hook
     // kind of middleware 
     // inside request schema


    //check if toUser exist or not
    const toUser=await User.findById(toUserId)
    if(!toUser)
    {
      res.status(404).send('User Not Found')
    }


     //If there is existing connection request
     const existingConnectionRequest= await ConnectionRequest.findOne({
      //pass all condition is $or
      $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId , toUserId:fromUserId}
      ]
     })
     if(existingConnectionRequest){
      throw new Error('Connection Req already exist')
     }


     //save the connectionReq
     const connectionRequest= new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
     })

     const data= await connectionRequest.save();
     res.json({
      message: req.user.firstName + "is "+ status + "in" + toUser.firstName,
      data,
     })

    }catch(err)
    {
      res.status(400).send('Error' + err.message)
    }
  });
module.exports=requestRouter;

//Note
// why "indexing" is imp , alot of users boards in , query becomes expensive
// in 1 million records , multiple people with same name , doing a search query by firstName 
// my DB will take alot of time time
// do unique= true or index=true for indexing
// compound indexing in mongodb