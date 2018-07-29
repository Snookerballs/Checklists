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
    },

    'accounts.incrementCreatedCounter': function() {
  if(Meteor.isServer){

    var newCount = Meteor.user().createdChecklistsCount+1;
    Meteor.users.update({_id: Meteor.userId()}, {
    $set:{
      createdChecklistsCount: newCount,
  }}, { upsert:true});
}
},
'accounts.decrementCreatedCounter':function() {
    if(Meteor.isServer){

    var newCount = Meteor.user().createdChecklistsCount-1;
    Meteor.users.update({_id: Meteor.userId()}, {
    $set:{
      createdChecklistsCount: newCount,
  }}, { upsert:true});
}
},
'accounts.updateMessage':function(newMessage){
if(Meteor.isServer){
   Meteor.users.update({_id: Meteor.userId()}, {
    $set:{
      "profile.message": newMessage,
  }}, { upsert:true});
}
},
'accounts.updateAvatar':function(url){
  if(Meteor.isServer){
   Meteor.users.update({_id: Meteor.userId()}, {
    $set:{
      "profile.avatar": url,
  }}, { upsert:true});
}
}
  });
}

Meteor.startup(function(){
if(Meteor.isServer){
    Accounts.onCreateUser(function(options, user) {
      user.createdChecklistsCount =  0;
      user.completedChecklistsCount =  0;
      user.createdAt = new Date();
      if(!user.profile) {
          user.profile = {};
      }
          user.profile.message = "";
          user.profile.avatar = "";
    return user;
});

    Meteor.publish(null, function() {
      return Meteor.users.find(this.userId, {fields: {createdChecklistsCount: 1, completedChecklistsCount: 1, createdAt: 1}});
});
}
})

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

Meteor.publish('users', function() {
    return Meteor.users.find({}, {fields:{profile: true}});
});
}
