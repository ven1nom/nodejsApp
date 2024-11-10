//entry point of nodejs app
const express=require('express')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');

const {connectDB}=require('../config/db')
const {User} = require('../model/user')
const {helper}= require('../utils/helper')
const {userAuth}=require('../middlewares/userAuth')
const app=express();
const PORT=3000;



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//import all router
const authRouter=require('../routes/auth');
const profileRouter=require('../routes/profile');
const requestRouter=require('../routes/requests');
const { userRouter } = require('../routes/user');

//using these routes
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use("/",userRouter);

//create a user
//first validate the req
//create password hashed - using bcrypt
//then add the user to DB - always do manually
//save the user

// app.post('/signup',async (req,res)=>{
//   // directly user body se na lekr ek func
//   //likhte hai jo validation ka kaam krega
//   //because nvr trust on req.body
//      helper(req);


//   //below code is for encryption

//      const {firstName,lastName,emailId,password}=req.body;
//      saltRounds=10;
//      const hashedPassword = await bcrypt.hash(password, saltRounds);
//     //get from user body 
//    const user=new User({
//     firstName,
//     lastName,
//     emailId,
//     password:hashedPassword,
//    });
//     //validation // !user
//     //duplicates // findOne
//     //save krna hoga
//     const saveUser= await user.save()
//     try{
//        if(!saveUser)
//        {
//          res.status(400).send('Issue with saving newUser')
//        }
//        res.status(200).send('newUser saved')
//     }
//     catch(err)
//     {
//        res.status(404).send('Error')
//     }
// })

//login
//take out emailID and passWord for req
//validator , sanitization to check for emailID 
//check if emailID exist or not
// if emailID exist , check password using "bcrypt compare"
//////////////////////////////////////////
// after successful login
//create a jwt / sessionID
// send a jwt inside cookie ( set up cookie using cookie-parser)
// wherever u wish to access the page(e.g profile/request etx), extract the token from cookie
// find that userId , if that exist allow user to do operation
// always have expiry time for -> session and token also
// write an helperFunc for this logic as its repeatable
//   app.post('/login', async (req, res) => {
//     try {
//         const { emailId, password } = req.body;

//         // Find user by email
//         const user = await User.findOne({ emailId:emailId });
//         if (!user) {
//             return res.status(400).send('User not found');
//         }

//         // Compare password with stored hash & req passwprd
//         // const isMatch = await bcrypt.compare(password, user.password);
//         // if (!isMatch) {
//         //     return res.status(400).send('Wrong password');
//         // }
//         //offload this password comparison functionality also to user db methods
//         const isPasswordValid=await user.validatePassword(password)


//         // If password matches crate a JWT token
//         // first parameter - userId , second Secret key
//        // var token = jwt.sign({ _id:user._id }, 'shhhhh');
//        // we passed the above functionality to DB level methods , as it has to done for each useer
//          const token=await user.getJWT(); 
//        //pass jwt token to cookie & send the cookie

//         res.cookie('token', token, {
//           httpOnly: true,
//           maxAge: 24 * 60 * 60 * 1000 // 24 hours
//       }).status(200).json({ 
//           message: 'Login successful',
//       });

//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// });

//GET request  to PROFILE
// app.get('/profile', userAuth,async (req,res)=>{
// //  const cookie=req.cookies;
// //  //grab the token from cookie
// //  const {token}=cookie;
// //  //check if token exist or not
// //  if(!token)
// //  {
// //   res.send("Token not exist , re-login")
// //  }
// //  // verify or decrypt the token 
// // var decoded = jwt.verify(token, 'shhhhh');
// // //find the userId in DB using token
// // const user = await User.findById(decoded._id);
// //         if (!user) {
// //             return res.status(404).json({ message: "User not found" });
// //         }

// //         res.json({
// //             message: "Profile accessed successfully",
// //             user: {
// //                 id: user._id,
// //                 email: user.emailId,
// //             }
// //         });
// // ported all above code to userAuth middleeware as for every request we have check it
// try{
//     const user=req.user;
//     res.send(user)
// }catch(err)
// {
//   res.status(400).send('Error: '+ err.message)
// }
    


//  /*res.send(cookie)
// console.log(cookie)*/

// })

//POST Connection Request also need to be loggined
// app.post('/sendConnectionRequest',userAuth,async (req,res)=>{
//   //read the user
//   const user=req.user;
//   res.send(user.firstName + " Connection request sent!!!")
// });

//get user by email
app.get('/user', async (req,res)=>{
  const userEmail=req.body.emailID
 try{
   const user=await User.findOne({emailID:userEmail})
   if(!user)
    {
      res.status(404).send('User not found')
    }
    res.status(200).send(user)
 }
 catch(err)
 {
    res.status(400).send('Something went wrong')
 }
})

//feed Api - get all users from DB


//delte user from DB
app.delete('/user', async (req,res)=>{
  const user=req.body.userId;
  try{
    const deleteUser=await findByIdAndDelete(user)
   if(!deleteUser)
   {
    res.send('Issue in deleting user');
   }
   res.status(200).send('User deleed successfully')
  }
  catch(err){
   res.status(400).send('Error occur while deleting user')
  }
})
//update the data of user
app.patch('/user/:userId',async (req,res)=>{
  const userId=req.params?.userId;
  const data=req.body;
  try{
    const ALLOWED_UPDATES=["photoURL","about","gender","age","skills"];
    const isUpdateAllowed=Object.keys(data).every((k)=>{
      ALLOWED_UPDATES.includes(k)
    });
    if(!isUpdateAllowed){
      throw new Error("Update not allowed")
    }
    if(data?.skills.length>10){
      throw new Error("Skills cannot be more than 10")
    }
    const user=await User.findByIdAndUpdate(
      {_id:userId},
      data,
    {
      returnDocument:true,
      runValidators:true,//adding custom validations for input
    });
    console.log(user);
    res.send('User updated succesfully');
  }catch(err){
    res.status(400).send("Something went wrong")
  }

})

connectDB()

.then(()=>{
    console.log('DB connection established....')
   app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)})})
.catch((err)=>{
    console.error('DB cannot be connected', err.data.messsage)
})
