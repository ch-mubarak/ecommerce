const mongoose=require("mongoose")
const passportLocalMongooseForAdmin=require("passport-local-mongoose")

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

adminSchema.plugin(passportLocalMongooseForAdmin)

module.exports=mongoose.model("Admin",adminSchema)
