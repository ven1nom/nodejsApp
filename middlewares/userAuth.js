const {User}=require('../model/user')
const jwt=require('jsonwebtoken')

const userAuth= async (req,res,next)=>{
 
 try{
   const cookie=req.cookies;
 //grab the token from cookie
 const {token}=cookie;
 //check if token exist or not
 if(!token)
 {
  res.send("Token not exist , re-login")
 }
 // verify or decrypt the token 
var decoded = jwt.verify(token, 'shhhhh');
//find the userId in DB using token
const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    //vimp , after finding user just attach it to req object
    req.user=user;   
    next(); 
 } catch(err){
    res.status(400).send('Error' + err.message);
 } 

}
module.exports={userAuth}