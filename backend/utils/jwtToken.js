//creating token  and saving into cookie

const sendToken = (user, statusCode, res)=>{
    const token = user.getJWTToken();

    //option for cookie
    const options = {
        httpOnly:true,
        expires: new Date(Number(Date.now()) + (Number(process.env.COOKIE_EXPIRE)*24*60*60*1000)),// days to milisecond
    };
    res.status(statusCode).cookie("token", token,options).json({
        success:true,
        user,
        token
    })
}

module.exports = sendToken;