const mongoose=require("mongoose")

const adminSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true
    },
    
})

module.exports=mongoose.model("Admin",adminSchema)
