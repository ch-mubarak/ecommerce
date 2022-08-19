const mongoose=require("mongoose")

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Category"
    },
    productImage:{
        type:String,
    },
    description:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true,
    },
    brand:String,
})

module.exports=mongoose.model("Product",productSchema)