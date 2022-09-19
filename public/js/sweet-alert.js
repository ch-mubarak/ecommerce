async function sweetConfirm(orderId) {
    try {
        let result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6F7E8B',
            cancelButtonColor: '#273952',
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
            $(`#order-${orderId}`).load(location.href + ` #order-${orderId}>*`, "");
            Swal.fire(
                'Cancelled!',
                'Your order has been cancelled.',
                'success'
            )
        }
    } catch (err) {
        window.location.reload()
        console.error(err)
    }
}