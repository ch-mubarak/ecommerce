async function sweetConfirm(orderId) {
    try {
        let result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor:'#6F7E8B',
            cancelButtonColor:'#273952',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No.',
            width: '25em'
        })
        if (result.isConfirmed) {
            cancelOrder(orderId)
        }
    } catch (error) {
        console.error(err)
    }
}

async function cancelOrder(orderId) {
    try {
        const response = await axios({
            method: "put",
            url: `/user/cancelOrder/${orderId}`
        })
        if (response.status === 201) {
            Swal.fire(
                'Cancelled!',
                'Your order has been cancelled.',
                'success'
            )
            document.getElementById(`orderStatusRoad-${orderId}`).innerHTML = `<span class="dot-danger"></span>
                  <hr class="flex-fill track-line-danger"><span class=""></span>
                  <hr class="flex-fill track-line-danger"><span class=""></span>
                  <hr class="flex-fill track-line-danger"><span class=""></span>
                  <hr class="flex-fill track-line-danger"><span class="d-flex justify-content-center align-items-center big-dot-danger dot">
                    <i class="fa-sharp fa-solid fa-xmark"></i></span>`

            document.getElementById(`orderStatusUpdate-${orderId}`).innerHTML = `<div class="d-flex flex-column justify-content-center"></div>
                  <div class="d-flex flex-column justify-content-center align-items-center"></div>
                  <div class="d-flex flex-column justify-content-center align-items-center"></div>
                  <div class="d-flex flex-column justify-content-center align-items-center"></div>
                  <div class="d-flex flex-column align-items-end"><span>Cancelled</span></div>`
        }
    } catch (err) {
        window.location.reload()
        console.error(err)
    }
}