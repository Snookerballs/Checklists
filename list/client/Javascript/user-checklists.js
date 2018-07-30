import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import {ChecklistCollection} from '../../lib/checklist-collection.js';
import {SavedChecklistCollection} from '../../lib/saved-checklist-collection.js';


Template.userInformation.helpers({
	    createdChecklistsCounter(){
    	return Meteor.users.findOne({username: Router.current().params._username}).createdChecklistsCount;
    },
    completedChecklistsCounter() {
    	return Meteor.users.findOne({username: Router.current().params._username}).completedChecklistsCount;
    },
    joinDate(){
    	return Meteor.users.findOne({username: Router.current().params._username}).createdAt;
    },
    	formatDate(date){
  		return moment(date).format('DD-MM-YYYY');
    },
    username(){
    	return Meteor.users.findOne({username: Router.current().params._username}).username;
    },
    message(){
    	var theMessage = Meteor.users.findOne({username: Router.current().params._username}).profile.message;
    	if(theMessage == ""){
    		theMessage = "Write a new message here!"
    	}
    	return theMessage;
    },
    avatar(){
    	var theAvatar = Meteor.users.findOne({username: Router.current().params._username}).profile.avatar;
    	if(theAvatar =="") {
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

    if(Meteor.users.findOne({username: Router.current().params._username})._id != Meteor.userId()){
            $('#saved-tab').hide();
             $('#complete-tab').hide();
             $('.editMessage').hide();
    }
})
