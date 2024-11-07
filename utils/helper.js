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
//validateProfileData
const validateProfileData=(req)=>{
    const allowedEditFields=['firstName','lastName','emailID','photoURL','gender','about','skills','age'];
    const isEditAllowed=Object.keys(req.body).every((field)=>
        allowedEditFields.includes(field)
    )
    return isEditAllowed;
}

module.exports={helper , validateProfileData}