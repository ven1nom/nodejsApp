const express = require('express')
//can also wrie logic for validators

//it will take req from body of functions
const  helper=(req)=>{
    //validation logic
    const{firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName || !emailId || !password)
    {
        throw new Error('Complete all details')
    }


}
module.exports={helper}