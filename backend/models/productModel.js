const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter product name"]
    },
    description:{
        type:String,
        required:[true,"Please Enter product description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter product price"],
        maxLength:[8,"price cannt exceed more that 8 digit"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
            required:[true,"Please Enter public_id of image"]
        },
        url:{
            type:String,
            required:[true,"Please Enter url of image"]
        }
    }],
    category:{
        type:String,
        required:[true,"Please Enter product category"]

    },
    stock:{
        type:Number,
        required:[true,"Please Enter product stock"],
        default:1,
        maxLength:[4," Stock cannt exceed more than 4 digit."]
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product",productSchema)