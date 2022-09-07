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
                const ItemIndex = myWishlist.myList.findIndex(product => product.productId == productId)
                if (ItemIndex > -1) {
                    myWishlist.myList.splice(ItemIndex, 1)
                    await myWishlist.save()
                    return res.status(204).json({ message: "removed from wishlist" })
                } else {
                    myWishlist.myList.push({ productId, name })
                    await myWishlist.save()
                    return res.status(201).json({ message: "added to wishlist" })
                }
            } else {
                await Wishlist.create({
                    userId: userId,
                    myList: [{ productId, name }]
                })
                return res.status(201).json({ message: "added to wishlist" })
            }


        } catch (err) {
            console.log(err)
            return res.status(500).json({ err })
        }
    },
    wishlistItemCount: async (req, res, next) => {
        const userId = req.user.id
        try {
            const wishlist = await Wishlist.findOne({ userId })
            let itemCount = (wishlist?.myList) ? (wishlist.myList.length) : 0
            res.locals.wishlistItemCount = itemCount
            return res.status(200).json({ itemCount: itemCount })

        } catch (err) {
            console.log(err)
            return res.status(500).json({ err })
        }
    }
}