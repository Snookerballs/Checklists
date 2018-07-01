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
    listId() {
    	return Router.current().params._id;
    }
});

Template.savedChecklist.onRendered(function() {

	$('.collapsible').collapsible();

		$('.checklist-box').each(function() {

		var checkboxNum = Number(this.id);
		var checkbox = SavedTasks.find().fetch()[checkboxNum];
		$(this).prop('checked',checkbox.checkStatus);
    //test
});

		$(document).on('click','.checklist-box', function(){
		//Get checkbox number
		var checkboxNum = Number(this.id);
		var checkboxToUpdate = SavedTasks.find().fetch()[checkboxNum];
		console.log(checkboxToUpdate);
		Meteor.call('saved-tasks.check', checkboxToUpdate._id, $(this).is(':checked'))
		console.log(SavedTasks.find().fetch());
});
});

Template.savedChecklist.events({
		'click #delete-button': function() {
			/*BUGGED*/
		var currChecklist = SavedChecklistCollection.findOne();
		Meteor.call('saved-tasks.remove', currChecklist);
		Meteor.call('saved-checklists.remove', currChecklist);
		Router.go("User Checklists");

	},
});



