import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'

Meteor.methods({
  find_by_username: function(name){
  	if(Meteor.isServer){
    var user = Accounts.findUserByUsername(name);
    return user.username;
}
  }
});

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

