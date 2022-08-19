const express=require("express")
const router=express.Router()
const Admin=require("../models/admin")
const User=require("../models/users")
const Category = require("../models/category")
const Product = require("../models/product")
const {
    addCategory,
    addProduct,
    deleteProduct,
    deleteCategory

} =require("../controllers/adminController")


router.get("/",(req,res)=>{
    res.render("admin/dashboard")
})


router.get("/users",async(req,res)=>{
    try{
        const users=await User.find({})
        res.render("admin/userManagement",{users:users})
    }catch(err){
        console.log(err)
        res.redirect("/")

    }
})

router.get("/categories",async(req,res)=>{
    const errorMessage=req.flash("message")
    const allCategories=await Category.find().sort({categoryName:1}).exec()
    res.render("admin/categoryManagement",{allCategories:allCategories,errorMessage:errorMessage})
})

router.get("/products",async(req,res)=>{
    try {
        const allProducts=await Product.find().populate("category").exec()
        res.render("admin/productManagement",{allProducts:allProducts})
        
    } catch (err) {
        console.log(err)
    }
})

router.get("/categories/addCategory",(req,res)=>{
    res.render("admin/addCategory")
})

router.get("/products/addProduct",async(req,res)=>{
    try{
        const allCategories=await Category.find().sort({categoryName:1}).exec()
        res.render("admin/addProduct",{allCategories:allCategories,foundProduct:""})
    }
    catch(err){
        console.log(err)
        res.redirect("/")

    }
})


router.get("/products/editProduct/:id",async(req,res)=>{
    try{
        const allCategories=await Category.find()
        const foundProduct=await Product.findById(req.params.id)
        res.render("admin/addProduct",{foundProduct:foundProduct,allCategories:allCategories})
    }catch(err){
        console.log(err)
    }
})

router.put("/addCategory",addCategory)

router.put("/addProduct",addProduct)

router.delete("/deleteProduct/:id",deleteProduct)

router.delete("/deleteCategory/:id",deleteCategory)



module.exports=router