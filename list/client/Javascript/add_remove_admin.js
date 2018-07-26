import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base'
import {Users} from '../../lib/accounts.js';

import '../html/add_remove_admin.html';


Template.add_remove_admin.helpers({
  admins() {
    return Roles.getUsersInRole('admin');
  },
});

Template.add_remove_admin.onCreated(function() {
  Meteor.subscribe('userData-other');
});

Template.add_remove_admin.events({
  'submit form': function(event, t) {
    event.preventDefault();

    var email = t.find('#_email').value;
    var username = t.find('#_username').value;

    Meteor.call("findByUsername", username, function(error,result){
      if(result) {
        var user1 = result;
        Meteor.call('addAdmin', user1);
      } else {
        Meteor.call("findByEmail", email, function(error,result) {
          if(result) {
            var user2 = result;
            Meteor.call('addAdmin', user2);
          }
        });
      }
    });
  },

  'click .remove_admin': function() {
    var username = document.getElementById('username').innerText;
    Meteor.call("findByUsername", username, function(error,result){
      if(result) {
        var user = result;
        Meteor.call('removeAdmin', user);
      }
    });
  }
});
