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
        if (response.status == 201) {
            let myOrderStatus = document.getElementById("status-" + orderId)
            let myOrderAction = document.getElementById("action-" + orderId)
            myOrderStatus.classList.replace("bg-warning", "bg-info")
            myOrderStatus.innerHTML = "Packed"
            myOrderAction.innerHTML = `<button class="btn btn-outline-dark" onclick="shipOrder('${orderId}')"><i class="fa-solid fa-truck-fast"></i> Ship Order</button>`
            toastr.options = { "positionClass": "toast-bottom-left" }
            toastr.success('<i class="fa-solid fa-boxes-packing"></i> orderId:' + orderId + ' ' + 'status updated to Packed.')
        } else {
            toastr.error('Error updating order status')
        }
    } catch (err) {
        window.location.reload()
        console.error(err)
    }
}

async function shipOrder(orderId) {
    try {
        const response = await axios({
            method: "put",
            url: `/admin/shipOrder/${orderId}`
        })
        if (response.status == 201) {
            let myOrderStatus = document.getElementById("status-" + orderId)
            let myOrderAction = document.getElementById("action-" + orderId)
            myOrderStatus.classList.replace("bg-info", "bg-primary")
            myOrderStatus.innerHTML = "Shipped"
            myOrderAction.innerHTML = `<button class="btn btn-outline-dark" onclick="outForDelivery('${orderId}')"><i class="fa-solid fa-house-chimney"></i> Out For Delivery</button>`
            toastr.options = { "positionClass": "toast-bottom-left" }
            toastr.success('orderId:' + orderId + ' ' + 'status updated to Shipped.')
        } else {
            toastr.error('Error updating order status')
        }
    } catch (err) {
        window.location.reload()
        console.error(err)
    }

}

async function outForDelivery(orderId) {
    try {
        const response = await axios({
            method: "put",
            url: `/admin/outForDelivery/${orderId}`
        })
        if (response.status == 201) {
            let myOrderStatus = document.getElementById("status-" + orderId)
            let myOrderAction = document.getElementById("action-" + orderId)
            myOrderStatus.classList.replace("bg-primary", "bg-dark")
            myOrderStatus.innerHTML = "Out for delivery"
            myOrderAction.innerHTML = `<button class="btn btn-outline-dark" onclick="deliverPackage('${orderId}')"><i class="fa-solid fa-thumbs-up"></i> Deliver Package</button>`
            toastr.options = { "positionClass": "toast-bottom-left" }
            toastr.success('<i class="fa-solid fa-truck-fast"></i> orderId:' + orderId + ' ' + 'is out for delivery.')
        } else {
            toastr.error('Error updating order status')
        }
    } catch (err) {
        window.location.reload()
        console.error(err)
    }
}

async function deliverPackage(orderId) {
    try {
        const response = await axios({
            method: "put",
            url: `/admin/deliverPackage/${orderId}`
        })
        if (response.status == 201) {
            let myOrderStatus = document.getElementById("status-" + orderId)
            let myOrderAction = document.getElementById("action-" + orderId)
            myOrderStatus.classList.replace("bg-dark", "bg-success")
            myOrderStatus.innerHTML = "Delivered"
            myOrderAction.innerHTML = `<button class="btn btn-outline-dark" disabled ><i class="fa-solid fa-thumbs-up"></i></button>`
            toastr.options = { "positionClass": "toast-bottom-left" }
            toastr.success('Order id' + orderId + 'status updated to delivered.')
        } else {
            toastr.error('Error updating status')
        }
    } catch (err) {
        window.location.reload()
        console.error(err)
    }
}
async function cancelOrder(orderId) {
    try {
        let result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6F7E8B',
            cancelButtonColor: '#212529',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No.',
            width: '25em'
        })
        if (result.isConfirmed) {
            const response = await axios({
                method: "put",
                url: `/admin/cancelOrder/${orderId}`
            })
            if (response.status == 201) {
                let myOrderStatus = document.getElementById("status-" + orderId)
                let myOrderAction = document.getElementById("action-" + orderId)
                myOrderStatus.classList.replace("bg-warning", "bg-danger")
                myOrderStatus.innerHTML = "Cancelled"
                myOrderAction.innerHTML = `<button class="btn btn-outline-dark" disabled ><i class="fa-solid fa-ban"></i></button>`
                toastr.options = { "positionClass": "toast-bottom-left" }
                toastr.success('Order cancelled successfully.')
            } else {
                toastr.error('Error updating order status')
            }
        }
    } catch (err) {
        window.location.reload()
        console.error(err)
    }
}

