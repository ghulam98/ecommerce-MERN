const mongoose = require('mongoose')
// mongoose.set("strictQuery", false);
const DB = ()=>{
    console.log("trigger start DB. wait for a while for connection stablishment")
    mongoose.connect(process.env.DB_URI ).then((data)=>{
    console.log(`database connected and host name is ${data.connection.host}`)
    }).catch((e)=>{
        console.log("issue with DB connection",e)

    })
}

module.exports = DB