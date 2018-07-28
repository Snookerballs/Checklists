import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { SavedTasks } from '../../lib/saved-task.js';
import {SavedChecklistCollection} from '../../lib/saved-checklist-collection.js';

Template.savedChecklist.helpers({

	task() {
		 	return SavedTasks.find();
		 },
    name() {
    	return SavedChecklistCollection.findOne().listName;
    },
    creator(){
    	return SavedChecklistCollection.findOne().creatorName;
    },
    defined(){
    	return (SavedChecklistCollection.find().count() == 1);
    },
    isCompleted(){
    	return SavedChecklistCollection.findOne().completionStatus;
    },
     timesCompleted(){
    	return SavedChecklistCollection.findOne().timesCompleted;
    }
});

Template.uncompletedChecklist.helpers({
	task() {
		 	return SavedTasks.find();
		 },
})

Template.completedChecklist.helpers({
		task() {
		 	return SavedTasks.find();
		 },

})

Template.uncompletedChecklistOptions.helpers({

	listId() {
    	return Router.current().params._id;
    },
})

Template.completedChecklistOptions.helpers({

		listId() {
    	return Router.current().params._id;
    },
})

Template.completedChecklist.onRendered(function() {
		$('.collapsible').collapsible();
})

Template.uncompletedChecklist.onRendered(function() {
	$(".savedChecklist").ready(function(){
	$('.collapsible').collapsible();
	//Check if Checklist has been completed
		$('.checklist-box').each(function() {
		var checkboxNum = Number(this.id);
		var checkbox = SavedTasks.find().fetch()[checkboxNum];
		$(this).prop('checked',checkbox.checkStatus);
    //test
		});
		$(".savedChecklist").on('click','.checklist-box', function(){
		//Get checkbox number
		var checkboxNum = Number(this.id);
		var checkboxToUpdate = SavedTasks.find().fetch()[checkboxNum];
		Meteor.call('saved-tasks.check', checkboxToUpdate._id, $(this).is(':checked'));

		//Checks completion status
		var completionStatus = SavedTasks.find({checkStatus: {$in: [true]}}).count()/SavedTasks.find().count();
		Meteor.call('saved-checklist.updateCompletionPercentage', SavedChecklistCollection.findOne()._id ,completionStatus);
		//Check completion status
		if(SavedChecklistCollection.findOne().completionPercentage == 1){
			$('#complete-button').prop('disabled', false);
		}else{
			$('#complete-button').prop('disabled', true);
		}
});

		//Check completion status
		if(SavedChecklistCollection.findOne().completionPercentage != 1){
			$('#complete-button').prop('disabled', 'disabled');
		} else{
			$('#complete-button').prop('disabled', false);
		}
})
});

Template.savedChecklist.events({
		'click #delete-button': function() {
		var currChecklist = SavedChecklistCollection.findOne();
		console.log(SavedTasks.find().fetch());
		Meteor.call('saved-tasks.remove', currChecklist);
		Meteor.call('saved-checklists.remove', currChecklist);
		Router.go("User Checklists");

	},
	'click #complete-button': function() {
		Meteor.call('saved-checklist.setCompletionStatus', SavedChecklistCollection.findOne()._id);
		Meteor.call('saved-checklist.incrementTimesCompleted', SavedChecklistCollection.findOne()._id);
		Meteor.call('accounts.incrementCompletedCounter');
		Router.go('User Checklists');
	},
	'click #reuse-button':function(){
		Meteor.call('saved-checklist.resetChecklist', SavedChecklistCollection.findOne()._id);
		SavedTasks.find().forEach((task) => Meteor.call('saved-tasks.check', task._id, false));
		Router.go('User Checklists');
	}
});



