
module.exports = {
    getBanner: (req, res) => {
        res.render("admin/bannerManagement", {
            layout: "layouts/adminLayout",
            extractScripts: true
        })
    },
}