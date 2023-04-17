const User = require("../models/userModel")
const sendToken = require("../utils/jwtToken")
const { sendEmail } = require("../utils/sendEmail")
const crypto = require("crypto")

//Register a user
exports.registerUser = async(req, res, next)=>{
    try {
        const {name, email, password} = req.body
        const user = await User.create({
            name,
            email,
            password,
            avatar:{
                public_id:"PublicId",
                url:"avtartUrl"
            }
        })
        sendToken(user,201,res)
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }


}

//Login
exports.loginUser = async(req, res, next)=>{
    const {email, password} = req.body
    //checnking if user and password get proper
    if(!email || !password){
        return res.status(400).json({success:false,message:"Please enter Email & Password"})
        
    }
    
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return res.status(401).json({success:false,message:"Invalid Email or Password"})
    }
    console.log(req.body)
    const isPasswordMatched = await user.comparePassword(password)
    if(!isPasswordMatched){
        return res.status(401).json({success:false,message:"Invalid Email or Password"})
    }
    sendToken(user,200,res)
    
}

//Logout

exports.logout = async( req, res, next)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({
                success:false,msg:"Already have been logged out."
            })
        }
        res.cookie('token',null,{expires: new Date(Date.now()), httpOnly:true})
        res.status(200).json({success:true,message:"Logged out success"})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }

}

//forgot password
exports.forgotPassword = async(req, res, next)=>{
    console.log(req.body)
    const user = await User.findOne({email:req.body.email})
    try {
        if(!user){
            return res.status(404).json({success:false,message:`User ${req.body.email} not found.`})
        }
        //get reset token
        const resetToken = user.getResetPasswordToken();

        //afetr geting token that schema is still not save in DB so need to save it.
        await user.save({validateBeforeSave: false})

        //now need to create url so that url send to user mail for reset password.
        // const resetPasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`
        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
        const message = `Your reset password token is: \n\n ${resetPasswordUrl} \n\n if you have requested it please ignore it.`

        //now time to send email to user mail using nodemailer.
        await sendEmail({
            email:user.email,
            subject: "Ecom password recover",
            message
        })
        return res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully. check in spam folder once.`
        })

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave: false})
        return res.status(500).json({success:false,message:error.message})
        
    }
}

// reset password
exports.resetPassword = async(req,res,next)=>{

    //creating token and hashing it
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()}
    })

    if(!user){
        return res.status(400).json({success:false, message:"Reset password token is invalid or expired."})
    }
    
    if(req.body.password !== req.body.confirmPassword){
        return res.status(400).json({success:false, message:"Confirm password not matched try again."})
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    sendToken(user,200,res)

}

// Get user detail
exports.getUserDetails = async(req,res,next)=>{
       const user = await User.findOne({email:req.user.email})
       res.status(200).json({success:true, user})
   
}

//Update password
exports.updatePassword = async(req, res, next)=>{
    try {
        
    
    const user = await User.findOne({email:req.user.email}).select("+password")// now pasword will also we can see in result
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
        return res.status(401).json({success:false,message:"Old password not matched."})
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return res.status(400).json({success:false,message:"Confirm password not matched try again."})
    }

    user.password = req.body.confirmPassword
    await user.save()
    sendToken(user,200,res)
} catch (error) {
    return res.status(400).json({success:false,message:error.message})
}
    

}


//Update Profile--ADMIN
exports.updateProfile = async(req, res, next)=>{
    try {
        

    //need to update bcose it will considering all attribute update only name email will change
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }
    //TODO: Avatar link do when cloudnary deal
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {new:true, runValidators: true, useFindAndModify: false})
    res.status(200).json({success:true, user})
} catch (error) {
    res.status(500).json({success:true, message:error.message})
        
}
}

//get all Users
exports.getAllUser = async(req,res,next)=>{
    try {
        const users = await User.find()
        res.status(200).json({success:true, users})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}


//get user detail by admin---ADMIN
exports.getSingleUserDetail = async(req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(201).json({success:false, message:`User with id ${req.params.id} is not exist.`})
        }
        res.status(200).json({success:true, user})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}


//Update other users role
exports.updateUserRole = async(req, res, next)=>{
    try {
        

    //need to update bcose it will considering all attribute update only name email will change
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {new:true, runValidators: true, useFindAndModify: false})
    res.status(200).json({success:true, user})
} catch (error) {
    res.status(500).json({success:true, message:error.message})
        
}
}

//delete user profile--ADMIN
exports.deleteUserAccount = async(req, res)=>{
    //TODO: will remove data from Cloudnary also
    try {
        const user = await User.findById(req.params.id)
        if(!user){
          return  res.status(201).json({success:true, message:`User with id ${req.params.id} is not exist`})
        } 
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({success:true, message:"User deleted successfully."})

    } catch (error) {
        res.status(500).json({success:true, message:error.message})
    }
}
