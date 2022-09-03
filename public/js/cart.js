$(window).on('load', async function () {
    try {
        const response = await axios({
            method: "get",
            url: `/user/cartItemCount`,
        })
        $(".cart-count").html(response.data.count)
    } catch (err) {
        console.error(err)
    }
})

async function deleteItem(productId, cartCount) {
    try {
        const response = await axios({
            method: "delete",
            url: `/user/cart/${productId}`,
            data: {
                cartCount: parseInt(cartCount)
            }
        })
        window.location.reload()
        console.log(response)
    } catch (error) {
        window.location.replace("/user/cart")
        console.error(error)
    }
}

async function addToCart(productId, productName, productPrice, quantity, offerPrice, currentQuantity) {
    if (currentQuantity == 1 && quantity == -1) {
        deleteItem(productId, 1);
    }
    else {
        try {
            const response = await axios({
                method: "put",
                url: `/user/addToCart/${productId}`,
                data: {
                    name: productName,
                    price: Number.parseFloat(productPrice),
                    quantity: Number.parseInt(quantity),
                    offerPrice: Number.parseFloat(offerPrice),
                }
            })
            $(".cart-count").html(response.data.count)
            console.log(response)
        }
        catch (err) {
            // window.location.replace(`/product/${productId}`)
            window.location.replace('/user/cart')
            console.error(err)
        }
    }
}

function cart(id, name, price, offerPrice) {
    let quantity = document.getElementById("itemQuantity").value
    addToCart(id, name, price, quantity, offerPrice)
}