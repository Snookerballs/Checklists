import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

import '../html/contact_us.html';

if (Meteor.isClient) {
  Template.contact_us.events({
    'submit form': function(event, t) {
      event.preventDefault();
      console.log('email func called.')

      var toAddr = "checklistsofficial@outlook.com";
      var userEmail = t.find('#yourEmail').value;
      var subj = t.find('#subject').value;
      var body = t.find('#input_body').value;
      Meteor.call('sendEmail', toAddr, subj, userEmail + "\n" + body);
      console.log('email sent.');
      $('#contactUsForm').trigger("reset");
      alert('Your request has been sent! We will contact you shortly.');
    }
  })
}

Template.contact_us.onRendered(function(){
$("#contactUsForm").validate({
  rules: {
        yourEmail: {
        required:true,
    },
    subject: {
        required:true,
    },
    input_body: {
      required:true,
    }
  },
  messages: {
        yourEmail: {
        required: "Please enter your email",
    },
    subject: {
        required: "Please enter a subject",
    },
    input_body: {
      required: "Please don't send blank messages!",
    }
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
});