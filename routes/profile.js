const express=require('express')

const profileRouter=express.Router();
const {userAuth}=require('../middlewares/userAuth') 
//GET Profile API
profileRouter.get('/profile', userAuth,async (req,res)=>{
    //  const cookie=req.cookies;
    //  //grab the token from cookie
    //  const {token}=cookie;
    //  //check if token exist or not
    //  if(!token)
    //  {
    //   res.send("Token not exist , re-login")
    //  }
    //  // verify or decrypt the token 
    // var decoded = jwt.verify(token, 'shhhhh');
    // //find the userId in DB using token
    // const user = await User.findById(decoded._id);
    //         if (!user) {
    //             return res.status(404).json({ message: "User not found" });
    //         }
    
    //         res.json({
    //             message: "Profile accessed successfully",
    //             user: {
    //                 id: user._id,
    //                 email: user.emailId,
    //             }
    //         });
    // ported all above code to userAuth middleeware as for every request we have check it
    try{
        const user=req.user;
        res.send(user)
    }catch(err)
    {
      res.status(400).send('Error: '+ err.message)
    }
        
    
    
     /*res.send(cookie)
    console.log(cookie)*/
    
    })
module.exports=profileRouter;