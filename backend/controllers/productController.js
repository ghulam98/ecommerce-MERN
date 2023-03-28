const Product = require("../models/productModel")
const ApiFeature = require("../utils/apiFeature")
//Create product ---Admin

exports.createProduct = async(req,res, next)=>{
    try{
        console.log("req",req.body)
        const product = await Product.create(req.body);
        res.status(200).json({success:true, product})
    }catch(e){
        res.status(500).json({success:false,message:e.message})

    }


}

//Update product ---Admin
exports.updateProduct = async(req,res,next)=>{
    try {
        console.log("inside update",req.body)
        let product = await Product.findById(req.params.id)
        if(!product){
            return res.status(500).json({success:false,message:"Product with this id is not exist"})
        }else{
            product = await Product.findByIdAndUpdate(req.params.id, req.body, {
                new:true,
                runValidators:true,
                useFindAndModify:false
            })
            return res.status(200).json({success:true, product})
        }
        
    } catch (error) {
        console.log("catch")
        return res.status(500).json({success:false,message:error.message})
        
    }
}

//Delete product---Admin
exports.deleteProduct = async(req, res, next)=>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(500).json({
                success:false,
                message:"Product not found"
            })
        }
        await Product.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            success:true,
            message:"Product deleted successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            success:false,
            message:`Some internal error cought ${error.message}`
        })
        
    }
}

//get product detail
exports.productDetail = async(req, res, next)=>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(500).json({
                success:false,
                message:"Product not found"
            })
        }
        
        return res.status(200).json({
            success:true,
            product
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            success:false,
            message:`Some internal error cought ${error.message}`
        })
        
    }
}

// list all product
exports.getAllProducts = async(req, res)=>{
        try {
            const resultPerPage = 5;
            const productCount = await Product.countDocuments()
            const feature = new ApiFeature(Product.find(), req.query).search().filter().pagination(resultPerPage)
            const products = await feature.query;
            res.status(200).json({success:true,productCount,products})
        } catch (error) {
            res.status(500).json({success:false,message:error.message})
            
        }
}