const Wishlist = require("../models/wishlist")

module.exports = {
    wishlist: async (req, res) => {
        const userId = req.user.id
        const findWishlist = await Wishlist.findOne({ userId: userId }).populate({
            path: "myList.productId",
            model: "Product"
        })
        res.render("master/wishlist", {
            findWishlist: findWishlist
        })
    },
    addToWishlist: async (req, res, next) => {
        try {
            const userId = req.user.id
            const { productId, name } = req.body
            const wishlist = await Wishlist.findOne({ userId })
            if (wishlist) {
                const ItemIndex = wishlist.myList.findIndex(p => p.productId == productId)
                if (ItemIndex > -1) {
                    wishlist.myList.splice(ItemIndex, 1)
                    await wishlist.save()
                } else {
                    wishlist.myList.push({ productId, name })
                    await wishlist.save()
                }
            } else {
                await Wishlist.create({
                    userId: userId,
                    myList: [{ productId, name }]
                })
            }
            res.redirect(req.get('referer'));
        } catch (err) {
            console.log(err)
            res.redirect("/")
        }
    },
    wishlistItemCount: async (req, res, next) => {
        const userId = req.user.id
        try {
            const wishlist = await Wishlist.findOne({ userId })
            res.locals.wishlistItemCount = (wishlist?.myList) ? (wishlist.myList.length) : 0

        } catch (err) {
            console.log(err)
        }
    }
}