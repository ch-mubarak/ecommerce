const orderStatus = document.querySelectorAll(".order-status")

for (let i = 0; i < orderStatus.length; i++) {
    if (orderStatus[i].innerHTML == "Pending") {
        orderStatus[i].classList.add("bg-warning")
    } else if (orderStatus[i].innerHTML == "Packed") {
        orderStatus[i].classList.add("bg-info")
    } else if (orderStatus[i].innerHTML == "Shipped") {
        orderStatus[i].classList.add("bg-primary")
    } else if (orderStatus[i].innerHTML == "Out for delivery") {
        orderStatus[i].classList.add("bg-dark")
    } else if (orderStatus[i].innerHTML == "Delivered") {
        orderStatus[i].classList.add("bg-success")
    } else {
        orderStatus[i].classList.add("bg-danger")
    }
}

async function packOrder(orderId) {
    try {
        const response = await axios({
            method: "put",
            url: `/admin/packOrder/${orderId}`
        })
        // window.location.reload()
        let myOrderStatus = document.getElementById("status-" + orderId)
        let myOrderAction = document.getElementById("action-" + orderId)
        myOrderStatus.classList.replace("bg-warning", "bg-info")
        myOrderStatus.innerHTML = "Packed"
        myOrderAction.innerHTML = `<button class="btn btn-sm btn-outline-dark" onclick="shipOrder('${orderId}')"><i class="fa-solid fa-truck-fast"></i></button>`
        toastr.success('<i class="fa-solid fa-boxes-packing"></i> orderId:' + orderId + ' ' + 'status updated to Packed.')

    } catch (err) {
        toastr.error('Error updating order status')
        console.error(err)

    }
}

async function shipOrder(orderId) {

    try {
        const response = await axios({
            method: "put",
            url: `/admin/shipOrder/${orderId}`
        })
        let myOrderStatus = document.getElementById("status-" + orderId)
        let myOrderAction = document.getElementById("action-" + orderId)
        myOrderStatus.classList.replace("bg-info", "bg-primary")
        myOrderStatus.innerHTML = "Shipped"
        myOrderAction.innerHTML = `<button class="btn btn-sm btn-outline-dark" onclick="outForDelivery('${orderId}')"><i class="fa-solid fa-house-chimney"></i></button>`

        toastr.success('orderId:' + orderId + ' ' + 'status updated to Out for delivery.')
        // console.log(response)
    } catch (err) {
        toastr.error('Error updating order status')
        console.error(err)
    }
}

async function outForDelivery(orderId) {

    try {
        const response = await axios({
            method: "put",
            url: `/admin/outForDelivery/${orderId}`
        })
        let myOrderStatus = document.getElementById("status-" + orderId)
        let myOrderAction = document.getElementById("action-" + orderId)
        myOrderStatus.classList.replace("bg-primary", "bg-dark")
        myOrderStatus.innerHTML = "Out for delivery"
        myOrderAction.innerHTML = `<button class="btn btn-sm btn-outline-dark" onclick="deliverPackage('${orderId}')"><i class="fa-solid fa-thumbs-up"></i></button>`

        toastr.success('<i class="fa-solid fa-truck-fast"></i> orderId:' + orderId + ' ' + 'is out for delivery.')
        console.log(response)
    } catch (err) {
        toastr.error('Error updating order status')
        console.error(err)
    }
}

async function deliverPackage(orderId) {
    try {
        const response = await axios({
            method: "put",
            url: `/admin/deliverPackage/${orderId}`
        })
        // window.location.reload()
        let myOrderStatus = document.getElementById("status-" + orderId)
        let myOrderAction = document.getElementById("action-" + orderId)
        myOrderStatus.classList.replace("bg-dark", "bg-success")
        myOrderStatus.innerHTML = "Delivered"
        myOrderAction.innerHTML = `<button class="btn btn-sm btn-outline-dark" disabled ><i class="fa-solid fa-thumbs-up"></i></button>`

        toastr.success('Order id' + orderId + 'status updated to delivered.')
    } catch (err) {
        toastr.error('Error updating status')
        console.error(err)
    }
}

async function cancelOrder(orderId) {
    try {
        const response = await axios({
            method: "put",
            url: `/admin/cancelOrder/${orderId}`
        })
        let myOrderStatus = document.getElementById("status-" + orderId)
        let myOrderAction = document.getElementById("action-" + orderId)
        myOrderStatus.classList.replace("bg-warning", "bg-danger")
        myOrderStatus.innerHTML = "Cancelled"
        myOrderAction.innerHTML = `<button class="btn btn-sm btn-outline-dark" disabled ><i class="fa-solid fa-thumbs-up"></i></button>`

        toastr.warning('Order cancelled successfully.')
    } catch (err) {
        toastr.error('Error cancelling order')
        console.error(err)
    }
}