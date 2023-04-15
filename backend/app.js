const express = require('express')
const { model } = require('mongoose')
const cookieParser = require("cookie-parser")

const app = express()
app.use(express.json())
app.use(cookieParser())

//Routes
const product = require("./routes/productRoute")
const user = require("./routes/userRoute")

app.use("/api/v1/", product)
app.use("/api/v1/", user)

module.exports = app
