const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

exports.isAuthenticated = async (req, res, next)=>{

    const {token} = req.cookies;
    if(!token){
        return res.status(401).json({
            success:false,msg:"Please login to access the resource"
        })
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await userModel.findById(decodedData.id)
    next()
}

exports.authorizedRoles = (...roles)=>{
    return (req, res, next)=>{
        console.log(req.user.role)
        if(!roles.includes(req.user.role)){
            return res.status(403).json({success:false, message:`Role: ${req.user.role} is not allowed to access this resource.`})
        }
        next()
    }

}

