const Category = require("../models/category")
const User = require("../models/users")

module.exports = {

    checkAdminPrivilege: function (req, res, next) {
        if (req.user.isAdmin) {
            next()
        }
        else {
            res.redirect("/error")
        }
    },

    addCategory: async (req, res) => {
        try {
            const category = new Category({
                categoryName: req.body.categoryName
            })
            await category.save()
            res.redirect("/admin/categories")

        } catch (err) {
            console.log(err)
            req.flash("message", "category already exists")
            res.redirect("/admin/categories")

        }
    },

    editCategory: async (req, res) => {
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
    },

    deleteCategory: async (req, res) => {
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
    },

    blockUser: async (req, res) => {
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
    },

    unblockUser: async (req, res) => {
        try {
            await User.findByIdAndUpdate(req.params.id, { isActive: true })
            res.redirect("/admin/users")
        } catch (error) {
            console.log(err)
            req.flash("message", "Error un blocking User")
            res.redirect("/admin/users")
        }
    }

}





