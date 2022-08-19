const mongoose= require("mongoose")
const passportLocalMongoose=require("passport-local-mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        required:true,
        default:true
    }

})

userSchema.plugin(passportLocalMongoose,{
    usernameField:"email"
});

module.exports=mongoose.model("User",userSchema)