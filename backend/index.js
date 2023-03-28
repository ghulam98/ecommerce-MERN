const app = require("./app")
const dotenv  = require("dotenv")
const DB = require('./DB')
var cors = require('cors')

app.use(cors())
//Config
dotenv.config({path:"./config/config.env"})

//Database connection
DB()


app.listen(process.env.PORT,()=>{
    console.log(`server is running on port http://localhost:${process.env.PORT} `)
})

