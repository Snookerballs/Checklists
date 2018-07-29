import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

import '../html/change_password.html';

Template.change_password.events({
  'submit form': function(event) {
    event.preventDefault();
    console.log('change_password function called');

    var old_password = event.target.old_password_inline.value;
    var new_password = event.target.new_password_inline.value;
    console.log(old_password);
    console.log(new_password);


    Accounts.changePassword(old_password, new_password, function(err) {
      if (err) {
        console.log('We are sorry but something went wrong.');
      } else {
        console.log('Your password has been changed. Welcome back!');
      }
    });

    $('#changePasswordForm').trigger("reset");
    return false;
  }
});

Template.change_password.onRendered(function(){
   $("#changePasswordForm").validate({
    rules: {
      new_password_inline: {
        required:true,
         minlength: 6,
      },

    },
    messages: {
      new_password_inline: {
        required: "Password cannot be blank",
        minlength: "Password must be at least 6 characters long",
      },

    },
    errorElement : 'div',
    errorPlacement: function(error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {
        error.insertAfter(element);
      }
    }
  })
})
