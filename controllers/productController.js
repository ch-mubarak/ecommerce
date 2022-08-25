const product = require("../models/product");
const Product = require("../models/product")
const fs = require("fs").promises

module.exports = {
    addProduct: async (req, res) => {
        try {

            const mainImage = req.files["productImage"][0].filename
            const subImages = req.files["subImages"].map((img) => img.filename)

            const product = new Product({
                name: req.body.name,
                brand: req.body.brand,
                category: req.body.category,
                quantity: req.body.quantity,
                description: req.body.description,
                productImagePath: {
                    mainImage: mainImage,
                    subImages: subImages
                }
            })
            await product.save()
            res.redirect("/admin/products")

        } catch (err) {
            console.log(err)
            req.flash("message", "File not supported or too many files")
            res.redirect("/admin/products")
        }

    },

    editProduct: async (req, res) => {
        let product
        try {
            product = await Product.findById(req.params.id)
            const oldMainImage = product.productImagePath.mainImage
            const oldSubImages = product.productImagePath.subImages
            const mainImage = req.files["productImage"] != null ? req.files["productImage"][0].filename : oldMainImage
            const subImages = req.files["subImages"] != null ? req.files["subImages"].map((img) => img.filename) : oldSubImages
            await Product.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                brand: req.body.brand,
                category: req.body.category,
                quantity: req.body.quantity,
                description: req.body.description,
                productImagePath: {
                    mainImage: mainImage,
                    subImages: subImages
                }
            })
            if (req.files["productImage"]) {
                await fs.unlink("./public/files/" + oldMainImage)
            }
            if (req.files["subImages"]) {
                oldSubImages.forEach(async (image) => {
                    await fs.unlink("./public/files/" + image)
                })
            }
            res.redirect("/admin/products")
        } catch (err) {
            console.log(err)
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id)
            const mainImage = product.productImagePath.mainImage
            const subImages = product.productImagePath.subImages
            await product.remove()
            await fs.unlink("./public/files/" + mainImage)
            subImages.forEach(async (image) => {
                await fs.unlink("./public/files/" + image)
            })
            res.redirect("/admin/products")
        } catch (err) {
            console.log(err)
        }
    }

}
