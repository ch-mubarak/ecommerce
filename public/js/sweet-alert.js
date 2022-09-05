function sweetConfirm(orderId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
        if (result.isConfirmed) {
            cancelOrder(orderId)
        }
    })
}

async function cancelOrder(orderId) {
    try {
        const response = await axios({
            method: "put",
            url: `/user/cancelOrder/${orderId}`
        })
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
        console.log(response)
    } catch (err) {
        console.error(err)
        window.location.reload()
        toastr.error('Error cancelling order')
    }
}