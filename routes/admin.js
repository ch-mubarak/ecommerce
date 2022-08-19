const express=require("express")
const router=express.Router()
const Admin=require("../models/admin")
const User=require("../models/users")
const Category = require("../models/category")
const Product = require("../models/product")
const category = require("../models/category")

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

router.put("/addCategory",async(req,res)=>{
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

router.put("/addProduct",async(req,res)=>{
    const product=new Product({
        name:req.body.name,
        brand:req.body.brand,
        category:req.body.category,
        quantity:req.body.quantity,
        description:req.body.description
    })
    try{
    await product.save()
    res.redirect("/admin/products")

    }catch(err){
        console.log(err)
        res.redirect("addProduct")    }
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

router.delete("/deleteProduct/:id",async(req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.redirect("/admin/products")
    }catch(err){
        console.log(err)
    }
})

router.delete("/deleteCategory/:id",async(req,res)=>{
    let category
    try{
        category=await Category.findById(req.params.id)
        await category.remove()
        res.redirect("/admin/categories")
    }catch(err){
        console.log(err)
        if(category==null){
            res.redirect("/admin")
        }else {
            req.flash("message","this categories have still products")
            res.redirect("/admin/categories")
        }

    }
})



module.exports=router