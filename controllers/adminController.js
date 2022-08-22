const Category = require("../models/category")
const User = require("../models/users")
const Product = require("../models/product")
const multer = require("multer")
const fs = require("fs").promises
const path = "./public"

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[1] === "jpg" || "png" || "jpeg") {
        cb(null, true);
    } else {
        cb(new Error("File not supported"), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});


function checkAdminPrivilege(req, res, next) {
    if (req.user.isAdmin) {
        next()
    }
    else {
        res.redirect("/error")
    }
}


const addCategory = async (req, res) => {
    const category = new Category({
        categoryName: req.body.categoryName
    })
    try {
        await category.save()
        res.redirect("/admin/categories")

    } catch (err) {
        console.log(err)
        res.redirect("/admin/addCategory")

    }
}

const addProduct = async (req, res) => {
    const product = new Product({
        name: req.body.name,
        brand: req.body.brand,
        category: req.body.category,
        quantity: req.body.quantity,
        description: req.body.description,
        productImagePath: req.file.filename
    })
    try {
        await product.save()
        res.redirect("/admin/products")

    } catch (err) {
        console.log(err)
        res.redirect("addProduct")
    }
}


const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        const productImagePath = product.productImagePath
        await product.remove()
        await fs.unlink(path + "/" + productImagePath)
        res.redirect("/admin/products")
    } catch (err) {
        console.log(err)
    }
}

const deleteCategory = async (req, res) => {
    let category
    try {
        category = await Category.findById(req.params.id)
        await category.remove()
        res.redirect("/admin/categories")
    } catch (err) {
        console.log(err)
        if (category == null) {
            res.redirect("/admin")
        } else {
            req.flash("message", "this categories have still products")
            res.redirect("/admin/categories")
        }

    }
}

const editCategory = async (req, res) => {
    try {
        await Category.findByIdAndUpdate(
            req.params.id,
            { categoryName: req.body.categoryName })
        res.redirect("/admin/categories")
    }
    catch (err) {
        console.log(err)
        req.flash("message", "error editing in category")
        res.redirect("/admin/categories")
    }
}

const blockUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.params.id,
            { isActive: false })
        res.redirect("/admin/users")
    } catch (err) {
        console.log(err)
        req.flash("message", "Error blocking User")
        res.redirect("/admin/users")
    }
}

const unblockUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { isActive: true })
        res.redirect("/admin/users")
    } catch (error) {
        console.log(err)
        req.flash("message", "Error un blocking User")
        res.redirect("/admin/users")
    }
}

const editProduct = async (req, res) => {
    let product
    try {
        product = await Product.findById(req.params.id)
        const oldProductImagePath = product.productImagePath
        if (req.file) {
            await Product.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                brand: req.body.brand,
                category: req.body.category,
                quantity: req.body.quantity,
                description: req.body.description,
                productImagePath: req.file.filename
            })
            await fs.unlink(path + "/" + oldProductImagePath)
        }
        else {
            await Product.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                brand: req.body.brand,
                category: req.body.category,
                quantity: req.body.quantity,
                description: req.body.description,
            })
        }
        res.redirect("/admin/products")
    } catch (err) {
        console.log(err)
    }
}


module.exports = {
    addCategory,
    addProduct,
    deleteProduct,
    deleteCategory,
    upload,
    unblockUser,
    blockUser,
    editCategory,
    editProduct,
    checkAdminPrivilege
}




