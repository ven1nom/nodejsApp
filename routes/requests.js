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
     
      //first step get all dynamic value 
      // Data sanitization
      // DB validation
      // make API changes
      // save in DB

      //A)
      //this is logged in user 
      // as we are getting from userAuth
     const fromUserId= req.user._id;
     const toUserId= req.params.toUserId;
     const status= req.params.status;

     //sanitization for upcoming request 
     // first allowed value
     // then check DB exist krta ya nhi
     // we just want 2 , ignored or interested
     const allowedStatus=["ignored","interested"]
     if(!allowedStatus.includes(status)){
      return res.status(400).json({message:'Invalid status value'+ status})
     }
     
     //Edge case 1
     // ValidationCheck - fromUserId and toUserId shouldnt be same
     //schema - pre hook
     // kind of middleware 
     // inside request schema

    //B)
    //DB validation -> jisko req bhej rahe hai woh exist krta hai
    //check if toUser exist or not
    const toUser=await User.findById(toUserId)
    if(!toUser)
    {
      res.status(404).send('User Not Found')
    }

     // Edge Case 2
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

     //C)
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

  //:status should be "accepted" or "rejected"
requestRouter.post("/request/review/:status/:requestId", userAuth , async (req,res)=>{
  // we need middleware cause , in order to accept request we wish our user to be login
  
  //Data sanitization: dynamic Id VIMP need to check
  //As its POST request we need to validate the status , its either should be "ignored" or "accepted"
  // also check if reuestId exist or not in DB

  //Pure API Logic:
  //our loggedIn user 
  // who will accept a request - toUser ( i.e loggedIn user)
  // In order to accept , the request first we have to check the status is it "ignored" or "interested"
  // If interested then only - toUser will accept request , if status is ignored he cant accept request
  
  
  try{
    const loggedInUser=req.user;
    const {status, requestId}=req.params;
    //DB sanitization
    const allowedStatus=["accepted","rejected"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({
          message:"Status not allowed!"
        })
    }
    //check requestId exist in DB or not
    // while adding this check use DB  
    const connectionRequest= await ConnectionRequest.findOne({
      _id:requestId,
      toUserId : loggedInUser._id,
      status: "interested",  
    });
    if(!connectionRequest){
      return res.status(404).json({
        message:"Connection request not found"
      })
    }

    //API logic
    //now we can modify status
    connectionRequest.status=status;

    const data= await connectionRequest.save();
   
    res.json({message:"Connection request" + status , data})

  }catch(err){
    res.status(400).send("Err"+ err.message)
 
  }
  
})


module.exports=requestRouter;

//Note
// why "indexing" is imp , alot of users boards in , query becomes expensive
// in 1 million records , multiple people with same name , doing a search query by firstName 
// my DB will take alot of time time
// do unique= true or index=true for indexing
// compound indexing in mongodb