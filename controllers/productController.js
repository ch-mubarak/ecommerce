const Product = require("../models/product")
const fs = require("fs").promises

module.exports = {
    addProduct: async (req, res) => { 
        try {
            req.files.forEach(img=>{console.log(img.filename)})
            const productImages = req.files != null ? req.files.map((img) => img.filename) : null
            console.log(productImages)
            const product = new Product({
                name: req.body.name,
                brand: req.body.brand,
                category: req.body.category,
                quantity: req.body.quantity,
                description: req.body.description,
                productImagePath: productImages
            })
            await product.save()
            res.redirect("/admin/products")

        } catch (err) {
            console.log(err)
            req.flash("message", "Error Adding product")
            res.redirect("/admin/products")
        }

    },

    editProduct: async (req, res) => {
        let product
        try {
            product = await Product.findById(req.params.id)
            const oldProductImages = product.productImagePath
            const productImages = req.files != null ? req.files.map((img) => img.filename) : oldProductImages
            await Product.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                brand: req.body.brand,
                category: req.body.category,
                quantity: req.body.quantity,
                description: req.body.description,
                productImagePath: productImages
            })
            if (req.files.length > 0) {
                oldProductImages.forEach(async (image) => {
                    await fs.unlink("./public/files/" + image)
                })
            }
            res.redirect("/admin/products")
        } catch (err) {
            console.log(err)
            req.flash("message", "Error updating product")
            res.redirect("/admin/products")
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id)
            const productImages = product.productImagePath
            await product.remove()
            productImages.forEach(async (image) => {
                await fs.unlink("./public/files/" + image)
            })
            res.redirect("/admin/products")
        } catch (err) {
            console.log(err)
            req.flash("message", "Error deleting product")
            res.redirect("/admin/products")
        }
    }

}
