const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")//Inbuilt lib

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter name"],
        maxLength:[30, "Name should not exceed more than 30 charecter"],
        minLength:[4,"Name should not less than 4 charecter"]
    },
    email:{
        type:String,
        required:[true, "Please Enter mail."],
        unique:true,
        validate:[validator.isEmail,"Please enter valid mail."]
    },
    password:{
        type:String,
        required:[true, "Please enter password."],
        minLength:[8, "Password should greater than 8 charecter"],
        select:false,//when this false then find() will not show untill specify like (+"password")
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,




})

//this method will trigger just before "save" or update into db.
//
userSchema.pre("save", async function (next){
    //this will check if password is not modified and rest r modified.
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})

//this will store our token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePassword = async function(Pass){
    return await bcrypt.compare( Pass, this.password)
}

//Generating password reset token

userSchema.methods.getResetPasswordToken = function(){
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex")
    //hashing and adding token to schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    //set expire time
    this.resetPasswordExpire = Date.now()+ 15*60*1000//miliscond for 15 mint

    return resetToken



}


module.exports = mongoose.model("User", userSchema)
