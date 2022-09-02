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
            const name = req.body.name
            const productId = req.params.id
            const myWishlist = await Wishlist.findOne({ userId: userId })

            if (myWishlist) {
                const ItemIndex = myWishlist.myList.findIndex(p => p.productId == productId)
                if (ItemIndex > -1) {
                    myWishlist.myList.splice(ItemIndex, 1)
                    await myWishlist.save()
                } else {
                    myWishlist.myList.push({ productId, name })
                    await myWishlist.save()
                }
            } else {
                await Wishlist.create({
                    userId: userId,
                    myList: [{ productId, name }]
                })
            }

            res.status(201).json({ message: "added to wishlist" })
        } catch (err) {
            console.log(err)
            res.status(500).json({ err })
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