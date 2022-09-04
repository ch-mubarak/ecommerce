const mongoose =require("mongoose")

const orderSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    deliveryAddress:{
        type:Object
    },
    products:{
        type:Object,
    },
    total:{
        type:Number
    },
    paymentType:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Pending"
    }
    
},{timestamps:true})

module.exports=mongoose.model("Order",orderSchema)