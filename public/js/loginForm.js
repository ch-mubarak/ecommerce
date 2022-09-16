
$(document).ready(function () {
    $("#myForm").validate({
        errorClass: "my-error-class"
    })

})

$('#myForm input').on('keyup blur', function () { // fires on every keyup & blur
    if ($('#myForm').valid()) {                   // checks form for validity
        $('#loginButton').prop('disabled', false);        // enables button
    } else {
        $('#loginButton').prop('disabled', 'disabled');   // disables button
    }
});


$('#loginButton').click(function () {
    $('#loginButton').html(`<span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
    Loading...`).attr("disabled", 'disabled')
    $("#myForm").submit()

});