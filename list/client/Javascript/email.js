import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

import '../html/email.html';

if (Meteor.isClient) {
  Template.email.events({
    'submit form': function(event, t) {
      event.preventDefault();
      console.log('email func called.')

      var toAddr = t.find('#input_email').value;
      var subj = t.find('#subject').value;
      var body = t.find('#input_body').value;
      Meteor.call('sendEmail', toAddr, subj, body);
      console.log('email sent.')
    }
  })
}
