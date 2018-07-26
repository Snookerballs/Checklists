import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'

export const Users = Meteor.users;

if(Meteor.isServer){
  Meteor.methods({
    find_by_username: function(name){
        var user = Accounts.findUserByUsername(name);
        return user.username;
    },
    findByUsername: function(name){
        var user = Accounts.findUserByUsername(name);
        return user;
    },
    findByEmail: function(email) {
        var user = Accounts.findUserByEmail(email);
        return user;
    },
    addAdmin: function(user) {
        Roles.addUsersToRoles(user, 'admin');
    },
    removeAdmin: function(user) {
        Roles.removeUsersFromRoles(user, 'admin');
    }
  });
}

// Server
if(Meteor.isServer){
Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId })
  } else {
    this.ready();
  }
});

Meteor.publish('userData-other', function () {
  if (this.userId) {
    return Meteor.users.find();
  } else {
    this.ready();
  }
});
}
