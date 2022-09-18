$(document).ready(async () => {
    try {
        const response = await axios.get("/user/cartItemCount")
        const itemCount = response.data.itemCount ? response.data.itemCount : 0
        $(".cart-item-count").html(itemCount)

    } catch (err) {
        console.error(err)
    }
})

async function deleteItem(productId) {
    try {
        const cartCount =document.getElementById(`currentQuantity-${productId}`)?.value
        const response = await axios({
            method: "delete",
            url: `/user/cart/${productId}`,
            data: {
                cartCount: parseInt(cartCount)
            }
        })
        let itemCount = Number($(".cart-item-count").html())
        itemCount -= Number(cartCount)
        if (itemCount != 0) {
            document.getElementById(`cartItem-${productId}`).remove()
            $(".cart-item-count").html(itemCount)
            $("#checkoutBox").load(location.href + " #checkoutBox>*", "");
            toastr.options = { "positionClass": "toast-bottom-right" }
            toastr.warning('item removed from cart.')

        } else {
            window.location.reload()
        }

    } catch (error) {
        console.error(error)
    }
}

async function addToCart(productId, productName, productPrice, quantity, offerPrice) {
    let currentQuantity = document.getElementById(`currentQuantity-${productId}`)?.value
    if (quantity == -1 && currentQuantity == 1) {
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
                    quantity: Number.parseInt(quantity),
                    offerPrice: Number.parseFloat(offerPrice),
                }
            })
            if (response.status == 200) {
                toastr.options = { "positionClass": "toast-bottom-right" }
                await Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'This product is out of stock',
                    confirmButtonColor: '#273952',
                    width: "25em",
                    timer: 2000
                })
                window.location.reload()
            } else {
                if (quantity == -1) {
                    toastr.options = { "positionClass": "toast-bottom-right" }
                    toastr.warning('item removed from cart.')
                } else {
                    toastr.options = { "positionClass": "toast-bottom-right" }
                    toastr.success('item added to cart.')
                }
                let itemCount = Number($(".cart-item-count").html())
                itemCount += Number.parseInt(quantity)
                $(".cart-item-count").html(itemCount)
                $(`#item-${productId}`).html('₹' + response.data.itemTotal)
                $("#checkoutBox").load(location.href + " #checkoutBox>*", "");
            }
        }
        catch (err) {
            await Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please login to add items to cart',
                confirmButtonColor: '#273952',
                width: "25em",
                timer: 3000
            })
            window.location ="/login"
            console.error(err)
        }
    }
}

function cart(id, name, price, offerPrice) {
    let quantity = document.getElementById("itemQuantity").value
    addToCart(id, name, price, quantity, offerPrice)
}