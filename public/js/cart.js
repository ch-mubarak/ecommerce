async function deleteItem(productId) {
    try {
        const response=await axios({
            method:"delete",
            url:"/user/cart",
            date:{
                productId:productId
            }
        })
        console.log(response)
        window.location.reload()
    } catch (error) {
        window.location.replace("/login")
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
                url: "/user/addToCart",
                data: {
                    productId: productId,
                    name: productName,
                    price: productPrice,
                    quantity: quantity
                }
            })
            window.location.reload()
            console.log(response)
        }
        catch (err) {
            window.location.replace("/login")
            console.error(err)
        }
    }
}

function cart(id,name,price){
   let quantity= document.getElementById("itemQuantity").value
   addToCart(id,name,price,quantity)
}