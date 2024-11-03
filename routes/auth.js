const express= require('express')
const app=express();
const authRouter=express.Router();
const {helper}= require('../utils/helper')
const {User} = require('../model/user')
const bcrypt = require('bcrypt');
//app.use() and router.use() works same
///signup
authRouter.post('/signup',async (req,res)=>{
    // directly user body se na lekr ek func
    //likhte hai jo validation ka kaam krega
    //because nvr trust on req.body
       helper(req);
  
  
    //below code is for encryption
  
       const {firstName,lastName,emailId,password}=req.body;
       saltRounds=10;
       const hashedPassword = await bcrypt.hash(password, saltRounds);
      //get from user body 
     const user=new User({
      firstName,
      lastName,
      emailId,
      password:hashedPassword,
     });
      //validation // !user
      //duplicates // findOne
      //save krna hoga
      const saveUser= await user.save()
      try{
         if(!saveUser)
         {
           res.status(400).send('Issue with saving newUser')
         }
         res.status(200).send('newUser saved')
      }
      catch(err)
      {
         res.status(404).send('Error')
      }
  })
//login api
authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Find user by email
        const user = await User.findOne({ emailId:emailId });
        if (!user) {
            return res.status(400).send('User not found');
        }

        // Compare password with stored hash & req passwprd
        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     return res.status(400).send('Wrong password');
        // }
        //offload this password comparison functionality also to user db methods
        const isPasswordValid=await user.validatePassword(password)


        // If password matches crate a JWT token
        // first parameter - userId , second Secret key
       // var token = jwt.sign({ _id:user._id }, 'shhhhh');
       // we passed the above functionality to DB level methods , as it has to done for each useer
         const token=await user.getJWT(); 
       //pass jwt token to cookie & send the cookie

        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }).status(200).json({ 
          message: 'Login successful',
      });

    } catch (error) {
        res.status(400).send(error.message);
    }
});
module.exports=authRouter