$(document).ready(function () {
    $("#myForm").validate({
      errorClass: "my-error-class",
      rules: {
        confirmedPassword: {
          equalTo: "#password"
        }
      },
      messages: {
        confirmedPassword: {
          equalTo: "Password Not matching",
        }
      }
    })

  })

  $('#myForm input').on('keyup blur', function () { // fires on every keyup & blur
    if ($('#myForm').valid()) {                   // checks form for validity
      $('#registerButton').prop('disabled', false);        // enables button
    } else {
      $('#registerButton').prop('disabled', 'disabled');   // disables button
    }
  });


  $('#registerButton').click(function () {
    $('#registerButton').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...`).attr("disabled", 'disabled')
    $("#myForm").submit()

  });