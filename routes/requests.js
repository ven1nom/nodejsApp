const express=require('express')

const requestRouter=express.Router();
const {userAuth}=require('../middlewares/userAuth')

//sendConnection request API
requestRouter.post('/sendConnectionRequest',userAuth,async (req,res)=>{
    //read the user
    const user=req.user;
    res.send(user.firstName + " Connection request sent!!!")
  });
module.exports=requestRouter