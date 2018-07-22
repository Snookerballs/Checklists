import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/dashboard.html';

Template.dashboard.helpers({
  username: function() {
    return Meteor.user().username;
  },
  email: function() {
    return Meteor.user().emails[0].address;
  }
});
