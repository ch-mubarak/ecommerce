$(document).ready(function () {
  $("#myForm").validate({
    errorClass: "my-error-class",
    rules: {
      confirmedPassword: {
        equalTo: "#password"
      },
      email:{
        myMail:true
      },
      name:{
        myName:true
      }
    },
    messages: {
      confirmedPassword: {
        equalTo: "Password Not matching.",
      },
      email:{
        myMail:"Please enter a valid email address."
      },
      name:{
        myName:"Numbers and Special character not allow."
      }
    }
  })

})

jQuery.validator.addMethod("myMail", function (value, element) {
  let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return value.match(mailFormat)
})

jQuery.validator.addMethod("myName", function (value, element) {
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
  $('#registerButton').html(`<span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
    Loading...`).attr("disabled", 'disabled')
  $("#myForm").submit()

});