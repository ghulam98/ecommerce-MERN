const express = require('express')
const { model } = require('mongoose')

const app = express()
app.use(express.json())
//Routes
const product = require("./routes/productRoute")
app.use("/api/v1/", product)

module.exports = app
