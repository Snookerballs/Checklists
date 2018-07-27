import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

if (Meteor.isServer) {
  Meteor.startup(function() {
    process.env.MAIL_URL='smtp://postmaster%40sandbox4b125f5cdfe04065b07b613ab45ecb5e.mailgun.org:f1d104a7d6ebb1749323d6e097c33e79-3b1f59cf-e4234cc8@smtp.mailgun.org:587'

    Accounts.emailTemplates.from='no-reply@checklists.com';
    Accounts.emailTemplates.sitename='Checklists!';

    Accounts.emailTemplates.verifyEmail.subject = function(user) {
      return 'Welcome to Checklists! Verify Your Email Address';
    };
    Accounts.emailTemplates.verifyEmail.text = function(user, url) {
      return 'Please click on the following link to verify your email address: ' + url;
    };

    Accounts.config({
      sendVerificationEmail: true
    })
  });

  Meteor.methods({
    'sendEmail': function(to, subj, text) {
      this.unblock();

      Email.send({
        to: to,
        from: 'no-reply@checklists.com',
        subject: subj,
        text: text
      })
    }

  })
}
