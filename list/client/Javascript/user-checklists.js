import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import {ChecklistCollection} from '../../lib/checklist-collection.js';
import {SavedChecklistCollection} from '../../lib/saved-checklist-collection.js';

Template.userInformation.helpers({
	createdChecklistsCounter(){
    	return Meteor.user().createdChecklistsCount;
    },
    completedChecklistsCounter() {
    	return Meteor.user().completedChecklistsCount;
    },
    joinDate(){
    	return Meteor.user().createdAt;
    },
    	formatDate(date){
  		return moment(date).format('DD-MM-YYYY');
    },
    username(){
    	return Meteor.user().username;
    },
    message(){
    	var theMessage = Meteor.user().profile.message;
    	if(theMessage == ""){
    		theMessage = "Write a new message here!"
    	}
    	return theMessage;
    },
    avatar(){
    	var theAvatar = Meteor.user().profile.avatar;
    	if(theAvatar == "") {
    		theAvatar = "/images/profile.jpg";
    	}

    	return theAvatar;
    },

})



Template.userInformation.events({
	'click .editMessage':function() {
		if($('.editMessage').text() == 'create'){
		$('#message').prop('disabled', false);
			$('.editMessage').text('check');
		} else {
			$('.editMessage').text('create');
			$('#message').prop('disabled', true);
			Meteor.call('accounts.updateMessage', $('#message').val());
		}
	},
	'submit #avatarForm':function(){
		event.preventDefault();
		Meteor.call('accounts.updateAvatar', event.target.avatarInput.value);
	}
})

Template.userChecklists.helpers({
	createdChecklist(){
                console.log("YRES");
		return ChecklistCollection.find();
	},
	savedChecklist(){
		return SavedChecklistCollection.find({completionStatus: false});
	},
    completedChecklist(){
        return SavedChecklistCollection.find({completionStatus: true});
    },
	formatDate(date){
  		return moment(date).format('DD-MM-YYYY');
    },
})

Template.userChecklists.onRendered(function(){
		$('.modal').modal();
	$('select').material_select();
	  $('#select-options').on('change', function(e) {
    	$('#select-options').trigger('select');
  });
	    $(document).ready(function(){
    $('.tabs').tabs();
  });


})