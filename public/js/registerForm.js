$(document).ready(function () {
  $("#myForm").validate({
    errorClass: "my-error-class",
    rules: {
      confirmedPassword: {
        equalTo: "#password"
      },
      email:{
        mail:true
      },
      name:{
        name:true
      }
    },
    messages: {
      confirmedPassword: {
        equalTo: "Password Not matching.",
      },
      email:{
        mail:"Please enter a valid email address."
      },
      name:{
        name:"Numbers and Special character not allowed."
      }
    }
  })

})

jQuery.validator.addMethod("mail", function (value, element) {
  let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return element.value.match(mailFormat)
})

jQuery.validator.addMethod("name", function (value, element) {
  return /^[A-Za-z ]+$/.test(value)
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