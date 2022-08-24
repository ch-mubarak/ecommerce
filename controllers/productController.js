const Product = require("../models/product")
const { upload } = require("./multerController")
const fs = require("fs").promises

const addProduct = async (req, res) => {
    try {
        const fileName = req.file != null ? req.file.filename : null
        const product = new Product({
            name: req.body.name,
            brand: req.body.brand,
            category: req.body.category,
            quantity: req.body.quantity,
            description: req.body.description,
            productImagePath: fileName
        })
        await product.save()
        res.redirect("/admin/products")

    } catch (err) {
        req.flash("message", "File not supported")
        res.redirect("/admin/products")
        console.log(err)
    }

}

const editProduct = async (req, res) => {
    let product
    try {
        product = await Product.findById(req.params.id)
        const oldProductImagePath = product.productImagePath
        const fileName = req.file != null ? req.file.filename : oldProductImagePath
        await Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            brand: req.body.brand,
            category: req.body.category,
            quantity: req.body.quantity,
            description: req.body.description,
            productImagePath: fileName
        })
        if (req.file) {
            await fs.unlink("./public/files/" + oldProductImagePath)
        }
        res.redirect("/admin/products")
    } catch (err) {
        console.log(err)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        const productImagePath = product.productImagePath
        await product.remove()
        await fs.unlink("./public/files/" + productImagePath)
        res.redirect("/admin/products")
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    addProduct,
    deleteProduct,
    editProduct
}
