const { authorizedRoles } = require("../middleware/auth")
const Order = require("../models/orderModel")
const Product = require("../models/productModel")


//Create new order
exports.newOrder = async(req, res)=>{
    try {
        
    
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body
    const  prodct = await Product.findById(orderItems[0].product)
    orderItems[0].name = prodct.name
    orderItems[0].price = prodct.price
    orderItems[0].image = prodct.image|| orderItems[0].image

    // console.log(prodct.name,prodct.price, prodct.image)
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })

    res.status(201).json({
        success:true,order
    })
} catch (error) {
        res.status(500).json({success:false, message:`${error.message}`} )
}
}

// get single order
exports.getSingleOrder = async (req, res)=>{
    try {
        
        const order = await Order.findById(req.params.id).populate("user", "name email")
        if(!order){
            return res.status(404).json({success:false, message:`still no any order for this user.`} )
        }
        res.status(200).json({success:true, order })

    } catch (error) {
        res.status(500).json({success:false, message:`${error.message}`} )
        
    }
}


//get logged in user Orders
exports.myOrders = async(req, res)=>{
    try {
        const orders = await Order.find({user:req.user._id})
        res.status(200).json({success:true, orders})
    } catch (error) {
        res.status(500).json({success:false, message:`${error.message}`} )
    }
} 

//get all orders --ADMIN(for showing admin inside dashboard)
exports.getAllOrders = async(req, res)=>{
    try {
        const orders = await Order.find()
        let totalAmount = 0;
        orders.forEach(order=>totalAmount+=order.totalPrice)
        res.status(200).json({success:true, totalAmount,orders})
        
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}


//Update order status ---ADMIN
exports.updateOrder = async (req, res)=>{
    try {
        const order = await Order.findById(req.params.id)
        if(!order){
            return res.status(404).json({success:false, message:`still no any order for this user.`} )
        }
        if(order.orderStatus === "Delivered"){
            return res.status(400).json({success:false, message:"You have already delivered this order."})
        }
        order.orderItems.forEach(async (ord)=>{
            const prod = await Product.findById(ord.product)
            prod.stock -= ord.quantity
            await prod.save({validateBeforeSave:false})
        })
        order.orderStatus = req.body.status
        if(req.body.status === "Delivered"){
            order.deliveredAt = Date.now()
        }
        await order.save({validateBeforeSave:false})
        res.status(200).json({success:true, message:`Order successfully ${req.body.status}`})

        
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
        
    }
}

// delete order --ADMIN

exports.deleteOrder = async (req, res)=>{
    try {
        const order = await Order.findOneAndDelete(req.params.id)
        if(!order){
            return res.status(404).json({success:false, message:`still no any order for this user.`} )
        }
        console.log(order,"llll")
        // await order.remove()
        res.status(200).json({success:true, })
        
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}





