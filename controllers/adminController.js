const User = require("../models/users")
const Category = require("../models/category")
const Product = require("../models/product")


const addCategory = async (req, res) => {
    const category = new Category({
        categoryName: req.body.categoryName
    })
    try {
        await category.save()
        res.redirect("/admin/categories")

    } catch (err) {
        console.log(err)
        res.render("admin/addCategory")

    }
}

const addProduct=async(req,res)=>{
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
}

const deleteProduct=async(req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.redirect("/admin/products")
    }catch(err){
        console.log(err)
    }
}

const deleteCategory=async(req,res)=>{
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
}


module.exports={
    addCategory,
    addProduct,
    deleteProduct,
    deleteCategory
}




