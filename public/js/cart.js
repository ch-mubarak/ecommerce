async function deleteItem(productId) {
    try {
        const response = await axios({
            method: "delete",
            url: `/user/cart/${productId}`,
        })
        console.log(response)
        window.location.reload()
    } catch (error) {
        window.location.replace("/user/cart")
        console.error(error)
    }
}

async function addToCart(productId, productName, productPrice, quantity) {
    if (document?.getElementById("cartQuantity")?.value == 1 && quantity == -1) {
        deleteItem(productId);
    }
    else {
        try {
            const response = await axios({
                method: "put",
                url: `/user/addToCart/${productId}`,
                data: {
                    name: productName,
                    price: Number.parseFloat(productPrice),
                    quantity: Number.parseInt(quantity)
                }
            })
            window.location.reload()
            console.log(response)
        }
        catch (err) {
            window.location.replace("/user/cart")
            console.error(err)
        }
    }
}

function cart(id, name, price) {
    let quantity = document.getElementById("itemQuantity").value
    addToCart(id, name, price, quantity)
}