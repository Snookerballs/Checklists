import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { Tasks } from '../../lib/task.js';
import { SavedTasks } from '../../lib/saved-task.js';
import {ChecklistCollection} from '../../lib/checklist-collection.js';
import {SavedChecklistCollection} from '../../lib/saved-checklist-collection.js';
import {Posts} from '../../lib/posts.js';


import '../html/checklist.html'; 


/*------- LIST -------*/
Template.checklist.helpers({

	task() {
		 	return Tasks.find();
		 },
    name() {
    	return ChecklistCollection.findOne().listName;
    },
    creator(){
    	return ChecklistCollection.findOne().username;
    },
    listRating(){
    	return ChecklistCollection.findOne().rating.toFixed(2);
    },
    raterNumber(){
		return ChecklistCollection.findOne().raters;
    },
    defined(){
    	return (ChecklistCollection.find().count() == 1);
    },
    listId() {
    	return Router.current().params._id;
    }
});


Template.checklist.onRendered(function(){
	$(".checklistDisplay").ready(function(){
		var isRated = false;
		var arr = ChecklistCollection.findOne({_id: Session.get('current-checklist')}).raterIds;
			for(var i = 0; i < arr.length; i++){
				if(arr[i].id == Meteor.userId()){
					isRated = true;
				}
			}
			console.log(arr);
			console.log(isRated);
		/** Initialize  Components **/
		$('.collapsible').collapsible();
			/** Initialize  Components **/
		if(ChecklistCollection.findOne().userId == Meteor.userId()){
			$('#rate-button').prop('disabled','disabled');
			$('#delete-button').show();
			$('#publish-button').show();
			$('#edit-button').show();

			if(ChecklistCollection.findOne().publish == true) {
				$('#publish-button').prop('disabled','disabled');
			} else {
				$('#comments-wrapper').hide();
			}
	 }else {
	 		$('#delete-button').hide();
	 		$('#publish-button').hide();
	 		$('#edit-button').hide();
	 		$('#rate-button').removeAttr("disabled");
	 }

	 if(isRated){
	 	$('#rate-button').prop('disabled',true);
	 }
	});

});

Template.checklist.events({
	'click #use-button': function() {
		var currChecklist = ChecklistCollection.findOne();
		Meteor.call('saved-checklists.create', currChecklist.listName, currChecklist.category, currChecklist.userId, currChecklist.username, Meteor.userId());
		var checklistId = SavedChecklistCollection.findOne({}, {sort: {createdAt: -1, limit: 1}})._id;
		Tasks.find().forEach((task) => Meteor.call('saved-tasks.insert', task.taskName, task.taskDescription,
			task.taskResources, checklistId));
		console.log(SavedChecklistCollection.find().fetch());
		console.log(SavedTasks.find().fetch());
		Router.go('User Checklists');
	},
		'click #delete-button': function() {
			/*BUGGED*/
		var currChecklist = ChecklistCollection.findOne();
		Meteor.call('posts.remove', currChecklist);
		Meteor.call('tasks.remove', currChecklist._id);
		Meteor.call('checklists.remove', currChecklist);
		Meteor.call('accounts.decrementCreatedCounter');
		Router.go("User Checklists");

	},
		'click #publish-button': function() {
			Meteor.call('checklists.publish', ChecklistCollection.findOne());

			Router.go("User Checklists");

	}
});

Template.rating.onRendered(function(){
	$(".ratingSystem").validate({
  rules: {
        starContainer: {
        required:true,
    },
  },
	messages: {
    	starContainer: {
        required: "You have not rated!.",
    },
},
    errorElement : 'div',
    errorPlacement: function(error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {
        error.insertAfter(element);
      }
    }
})
});


Template.comments.events({
	'submit .commentForm': function() {
		event.preventDefault();
		var comment = event.target.comment.value;
		Meteor.call('posts.insert', comment, Session.get('current-checklist'), Meteor.userId(), Meteor.user().username);
		event.target.comment.value = '';
	}
});

Template.comments.helpers({
    post() {
    	return Posts.find();
    },
        formatDate(date){
  		return moment(date).format('DD-MM-YYYY, HH:mm');
    }

});

Template.rating.events({
	'click #star-one': function() {
		$('.star').css("color", 'grey');
		$("#star-one").css("color", "#FD4");
		$("#one").prop("checked", true);
	},
	'click #star-two': function() {
		$('#star-one').trigger('click');
		$("#star-two").css("color", "#FD4");
		$("#two").prop("checked", true);
	},	
	'click #star-three': function() {
		$('#star-two').trigger('click');
		$("#star-three").css("color", "#FD4");
		$("#three").prop("checked", true);
	},	
	'click #star-four': function() {
		$('#star-three').trigger('click');
		$("#star-four").css("color", "#FD4");
		$("#four").prop("checked", true);
	},	
	'click #star-five': function() {
		$('#star-four').trigger('click');
		$("#star-five").css("color", "#FD4");
		$("#five").prop("checked", true);
	},
		'submit .rating-system': function() {
			event.preventDefault();
			var score =Number($('input[name=starContainer]:checked').val());
			console.log(score);
			if(isNaN(score)) {
				console.log("this is a NaN");
			} else {
				Meteor.call('checklists.updateRating',Session.get('current-checklist'), score);
				Meteor.call('checklists.updateRaters', Session.get('current-checklist'), String(Meteor.userId));
				$('.star').css("color", 'grey');
				$('input[name=star-container]:checked').attr('checked', false);
			}

	},
},

)