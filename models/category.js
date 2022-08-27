const mongoose=require("mongoose")
const Product=require("./product")
const categorySchema= new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        unique:true,
    }
})

categorySchema.pre("remove",function(next){
    Product.find({category:this.id},(err,products)=>{
        if(err){
            next(err)
        }
        else if(products.length>0){
            next(new Error("This category has still products"))
        }
        else{
            next()
        }
    })
})

module.exports=mongoose.model("Category",categorySchema)