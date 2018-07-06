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

    return false;
  }
});
