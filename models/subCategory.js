const mongoose =require("mongoose")
const subCategorySchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        required:true
    }
})


module.exports=mongoose.model("SubCategory",subCategorySchema)