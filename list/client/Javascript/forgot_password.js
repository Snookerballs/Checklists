import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Session } from 'meteor/session'

import '../html/forgot_password.html';
import '../html/reset_password.html';

Template.forgot_password.events({
  'submit form': function(event) {
    event.preventDefault();
    console.log('forgot_password function called');

    var email = event.target.input_email.value;
    console.log(email);

    Accounts.forgotPassword({email: email}, function (e, r) {
      if (e) {
        console.log(e.reason);
      } else {
        console.log('Email sent.');
      }
    });

    return false;
  }
});

Template.reset_password.events({
  'submit form': function(event) {
    event.preventDefault();
    console.log('reset_password function called');

    var password = event.target.new_password.value;
    var token = Session.get("token");
    console.log(token);
    console.log(password);

    Accounts.resetPassword(token, password);
    console.log('password reset.');
    Router.go('Home');
  }
});

Accounts.onResetPasswordLink(function(token, done) {
  console.log('reset password link called.');
  Session.set("token", token);
  Router.go('reset_password');
  done();
})
