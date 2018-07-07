import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

if (Meteor.isServer) {
  Meteor.startup(function() {
    process.env.MAIL_URL='smtp://postmaster%40sandbox8545237cf5154c12819f3d4f49b0774a.mailgun.org:36d62d19f99d7c9e14a02f3d62e79dbc-770f03c4-a5e015c3@smtp.mailgun.org:587'

    Accounts.emailTemplates.from='no-reply@checklists.com';
    Accounts.emailTemplates.sitename='My Site';

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
