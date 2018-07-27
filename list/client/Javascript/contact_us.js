import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

import '../html/contact_us.html';

if (Meteor.isClient) {
  Template.contact_us.events({
    'submit form': function(event, t) {
      event.preventDefault();
      console.log('email func called.')

      var toAddr = "checklistsofficial@outlook.com";
      var subj = t.find('#subject').value;
      var body = t.find('#input_body').value;
      Meteor.call('sendEmail', toAddr, subj, body);
      console.log('email sent.');
      $('#contactUsForm').trigger("reset");
    }
  })
}
