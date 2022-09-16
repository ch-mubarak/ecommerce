const Banner = require("../models/banner")
const _ = require("lodash")
const { findById } = require("../models/banner")

module.exports = {

    getBanner: async (req, res) => {
        try {
            const allBanners = await Banner.find().sort({ createdAt: -1 })
            const errorMessage = req.flash("message")
            res.render("admin/bannerManagement", {
                allBanners: allBanners,
                errorMessage: errorMessage,
                layout: "layouts/adminLayout",
            })
        } catch (err) {
            console.log(err)
            res.redirect("/admin")
        }
    },

    addBanner: async (req, res) => {
        try {
            const { title, viewOrder, caption, promoCoupon, url } = req.body
            const bannerImagePath = req.file != null ? req.file.filename : null
            const newBanner = new Banner({
                title: _.startCase(_.toLower(title)),
                caption: caption?.toUpperCase(),
                promoCoupon: promoCoupon?.toUpperCase(),
                viewOrder,
                url,
                bannerImagePath
            })
            await newBanner.save()
            res.redirect("/admin/banners")
        } catch (err) {
            req.flash("message", "Error creating banner.")
            res.redirect("/admin/banners")
            console.log(err)
        }
    },

    activate: async (req, res) => {
        try {
            const bannerId = req.params.id
            const myBanner = await Banner.findById(bannerId)
            if (myBanner.viewOrder == "primary") {
                const isExist = await Banner.findOne({ $and: [{ viewOrder: "primary" }, { isActive: true }] })
                if (isExist) {
                    return res.status(403).json({ message: "cant activate multiple primary banners at same time" })
                }
            }
            myBanner.isActive = true
            await myBanner.save()
            res.status(201).json({ message: "Activated" })
        } catch (err) {
            console.log(err)
            res.status(500).json({ err })
        }
    },

    deactivate: async (req, res) => {
        try {
            const bannerId = req.params.id
            await Banner.findByIdAndUpdate(bannerId, { isActive: false })
            res.status(201).json({ message: "Deactivate" })
        } catch (err) {
            res.status(500).json({ err })
        }
    }
}