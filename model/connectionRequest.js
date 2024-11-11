const mongoose=require('mongoose');

const connectionRequestSchema=new mongoose.Schema({
     //2 cheeze rahegi
     fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", //refrence to the user collection
        required:true, 
    },
     toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
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


//compound indexing for multiple find ( findUserId & toUserId)
// ConnectionRequest.find({fromUserId: 1272ww37973 , toUserId: 83783232})
connectionRequestSchema.index({fromUserId:1, toUserId:1});

//pre-hook in relation with request
connectionRequestSchema.pre("save" , function(){
   //call everytime connection request is saved
   // called "pre-save"

   // "this" signifies the current instance of connectionRequest
   const connectionRequest=this;
   //checking if my from & to userId are same 
   // before saving it in DB
   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
      throw new Error('Cannot send connection request to yourself')
   }
   //always call next()
   // code will break otherwise
   next()
})



const ConnectionRequest= new mongoose.model('ConnectionRequest', connectionRequestSchema)
module.exports= ConnectionRequest