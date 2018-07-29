import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../html/dashboard.html';

Template.userDashboard.helpers({
  username: function() {
    return Meteor.user().username;
  },
  email: function() {
    return Meteor.user().emails[0].address;
  },
   avatar(){
    	var theAvatar = Meteor.user().profile.avatar;
    	if(theAvatar =="") {
    		theAvatar = "/images/profile.jpg";
    	}

    	return theAvatar;
    },
});
