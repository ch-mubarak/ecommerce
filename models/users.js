const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique:true,
        required: true
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }

})

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email",
    findByUsername: function (model, queryParameters) {
        // Add additional query parameter - AND condition - active: true
        queryParameters.isActive = true;
        return model.findOne(queryParameters);
    }

});

module.exports = mongoose.model("User", userSchema)