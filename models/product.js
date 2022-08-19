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
    size:{
        type:Number,
        required:true
    },
    productImage:{
        type:String,
    },
    description:{
        type:String,
        required:true
    },
    brand:String,
})

module.exports=mongoose.model("Product",productSchema)