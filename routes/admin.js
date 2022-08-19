const express=require("express")
const router=express.Router()
const Admin=require("../models/admin")
const User=require("../models/users")
const Category = require("../models/category")
const Product = require("../models/product")

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
    const allCategories=await Category.find({})
    res.render("admin/categoryManagement",{allCategories:allCategories})
})

router.get("/products",(req,res)=>{
    res.render("admin/productManagement")
})

router.get("/categories/addCategory",(req,res)=>{
    res.render("admin/addCategory")
})

router.get("/products/addProduct",(req,res)=>{
    res.render("admin/addProduct")
})

router.put("/categories/addCategory",async(req,res)=>{
    const category=new Category({
        categoryName:req.body.categoryName
    })
    try{
        await category.save()
        res.redirect("/admin/categories")

    }catch(err){
        console.log(err)
        res.render("admin/addCategory")

    }
})


module.exports=router