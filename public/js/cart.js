$(document).ready(async () => {
    try {
        const response = await axios.get("/user/cartItemCount")
        const itemCount = response.data.itemCount ? response.data.itemCount : 0
        $(".cart-item-count").text(itemCount)

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
        console.log(response)
        window.location.reload()
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
            console.log(response)
            if (response.status == 200) {
                toastr.error('This product is Out of stock.')
            } else {
                window.location.reload()
            }
        }
        catch (err) {
            window.location.replace("/login")
            console.error(err)
        }
    }
}

function cart(id, name, price, offerPrice) {
    let quantity = document.getElementById("itemQuantity").value
    addToCart(id, name, price, quantity, offerPrice)
}