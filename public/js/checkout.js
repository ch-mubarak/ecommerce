
document.forms["checkoutForm"].addEventListener("submit", async (event) => {
    event.preventDefault();
    const paymentType = $('input[name=paymentType]:checked', '#checkoutForm').val()
    data = new URLSearchParams(new FormData(event.target))
    if (paymentType == "cod") {
        checkout(data)
    } else {
        razorpay(orderId, amount)
    }
});


async function checkout(data) {
    try {
        const response = await axios({
            url: '/user/checkout',
            method: "post",
            data: data,
        });
        if (response.status == 201) {
            await Swal.fire({
                title: 'Congrats!',
                text: 'Order Successful',
                icon: 'success',
                width: "25em",
                timer: 3000
            })
            window.location = "/user/myOrders"
        }
    } catch (err) {
        console.error(err)
        await Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            width: "25em",
            timer: 3000
        })
        window.location = "/user/checkout"
    }
}


function razorpay(orderId, amount) {
    let options = {
        "key": "rzp_test_qdnGosbHKRU60Y", // Enter the Key ID generated from the Dashboard
        "name": "Fashion",
        "amount": amount,
        "order_id": orderId, // For one time payment
        "retry": false,
        "theme": {
            "color": "#273952"
        },
        // This handler function will handle the success payment
        "handler": async function (response) {
            // alert(response.razorpay_payment_id);
            try {
                const verification = await axios({
                    method: "post",
                    url: `/user/payment/verify/${orderId}`,
                    data: {
                        response: response,
                    }
                })
                if (verification.data.signatureIsValid) {
                    const paymentId = response.razorpay_payment_id

                    //appending order Id and payment id to data to update on database

                    data.append("orderId", orderId)
                    data.append("paymentId", paymentId)

                    //calling checkout after payment verification
                    checkout(data)

                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Payment Failed!',
                        width: "25em",
                        timer: 2000,
                    })
                    window.location = "/user/checkout"
                }
            } catch (err) {
                console.log(err)
                window.location = "/user/myOrders"
            }

        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    rzp1.on('payment.failed', async function (response) {
        await Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Payment Failed!',
            width: "25em",
            timer: 2000,
        })
        window.location = "/user/checkout"
    });

}

// dom manipulation for saved address
function fillForm(address, index) {
    let myAddress = JSON.parse(address)
    $("#addressInputField :input").prop("disabled", true)
    $("#new-address").prop("disabled", false)
    $("#new-address").prop("checked", false)
    $("#address-index").prop("disabled", false)

    $("#address-index").val(index)
    $("[name='firstName']").val(myAddress.firstName)
    $("[name='lastName']").val(myAddress.lastName)
    $("[name='house']").val(myAddress?.house)
    $("[name='address']").val(myAddress.address)
    $("[name='city']").val(myAddress.city)
    $("[name='state']").val(myAddress.state)
    $("[name='pincode']").val(myAddress.pincode)
    $("[name='phone']").val(myAddress.phone)

}

function handleChange(checkbox) {
    if (checkbox.checked == true) {
        $("#addressInputField :input").not("[name=email]").prop("disabled", false)
        $("#addressInputField :input").not("[name=newAddress]").val('')
    }
}

async function removeAddress(index) {
    try {
        let result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6F7E8B',
            cancelButtonColor: '#273952',
            confirmButtonText: 'Yes, Delete it!',
            cancelButtonText: 'No.',
            width: '25em'
        })
        if (result.isConfirmed) {
            const response = await axios.delete(`/user/deleteAddress/${index}`)
            if (response.status == 204) {
                document.getElementById(`address-${index}`).remove()
                toastr.options = {
                    "positionClass": "toast-bottom-right"
                }
                toastr.success('address removed successfully.')
            }
        }
    } catch (error) {
        console.error(err)
    }
}


//autocomplete

const allStates = ["Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry"]
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

