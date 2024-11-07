const mongoose=require('mongoose');

const connectionRequestSchema=new mongoose.Schema({
     //2 cheeze rahegi
     fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true, 
    },
     toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true, 
     },
     status:{
        type:String,
        required:true, 
        enum:{
         values:["ignore","interested","accepted","rejected"],
        message:`{VALUE} is incorrect status type` 
        }
       
     }
},{timestamps:true,})
const ConnectionRequest= new mongoose.model('ConnectionRequest', connectionRequestSchema)
module.exports= ConnectionRequest