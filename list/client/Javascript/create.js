import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { Tasks } from '../../lib/checklist.js';
import {ChecklistCollection} from '../../lib/checklist-collection.js';

import '../html/create.html'; 

var ChecklistInCreation = new Mongo.Collection(null);
var taskToUpdate;

$(document).ready(function(){


});

/*------- LIST -------*/
Template.list.helpers({
	task(){
		return ChecklistInCreation.find();
	},
});

Template.list.events({
	'click .deleteTask': function() {
		ChecklistInCreation.remove(this);
	},
});

/*------- CREATE_CHECKLIST -------*/
Template.create_checklist.onRendered(function(){
		/** Initialize  Components **/
	$('.modal').modal();
	$('.collapsible').collapsible();

	$('input[type=checkbox]').each(function() {
		if(this.nextSibling.nodeName != 'label') {
			$(this).after('<label for="'+this.id+'"></label>')
		}
	});
	$('.dropdown-trigger').dropdown();
	$('select').material_select();
	$('.collapsible-header').click(function(e){ e.stopPropagation();});
});

Template.create_checklist.events({
	'click .saveCheckListButton': function() {
		ChecklistInCreation.remove(this);
	}
});

Template.create_checklist.events({
	'submit .checklist-form': function() {
		event.preventDefault();

		//Save variables to Checklist Collection
		var listName = event.target.checklistName.value;
		var category = $( "#checklistCategory option:selected" ).text();
		Meteor.call('checklists.create', listName, category);
		var checklistId = ChecklistCollection.findOne({}, {sort: {DateTime: -1, limit: 1}})._id;

		ChecklistInCreation.find().forEach((task) => Meteor.call('tasks.insert', task.taskName, task.taskDescription,
			task.taskResources, checklistId));

		// Re Initialize ChecklistInCreation
		event.target.checklistName.value =' ';
		ChecklistInCreation.remove({});

		//BUG TESTING
		console.log(ChecklistCollection.find().fetch());
		console.log(Tasks.find().fetch());
	}
});


/*------- TASK FORMS -------*/

Template.addTaskForm.events({
	'submit .add-form': function() {
		event.preventDefault();

		//Retrieve Information in the textboxes
		var taskNameVar = event.target.taskName.value;
		var descriptionVar = event.target.description.value;
		var taskResourcesVar = event.target.resources.value;

		//Add task to ChecklistInCreation
		ChecklistInCreation.insert({
			taskName: taskNameVar,
			taskDescription: descriptionVar,
			taskResources: taskResourcesVar,
			createdAt: new Date(),
		});

		//console.log(ChecklistInCreation.find().fetch());

		//Reset text in Add Task Form
		event.target.taskName.value = ' ';
		event.target.description.value = ' ';
		event.target.resources.value = ' ';

		$('.collapsible').collapsible();
	}
});

Template.editTaskForm.events({
	'submit .edit-form': function() {
		event.preventDefault();
		//Retrieve Information in the textboxes
		var taskNameVar = event.target.editTaskName.value;
		var descriptionVar = event.target.editDescription.value;
		var taskResourcesVar = event.target.editResources.value;
		

		//Update relavant information
		ChecklistInCreation.update({createdAt: taskToUpdate.createdAt}, {
			taskName: taskNameVar,
			taskDescription: descriptionVar,
			taskResources: taskResourcesVar,
		}, { upsert:true});
	}
});


$(document).on('click','.editTask', function(){
	$('#edit-task-modal').modal();
	$('#edit-task-modal').modal('open');

	var editingTask = $(this).parent().closest('li').attr('class').split(' ');
	var taskNum = editingTask[0];
	var name = $('.'+taskNum).find('.name').text();
	var description = $('.'+taskNum).find('.description').text();
	var resources = $('.'+taskNum).find('.resources').text();

	$('#editTaskName').val(name);
	$('#editDescription').val(description);
	$('#editResources').val(resources);


	taskToUpdate = ChecklistInCreation.find({taskName: name, 
		taskDescription: description,
		taskResources: resources}).fetch()[0];
	//BUG: .val() does not copy over html formatting ><
});




/*
$(document).on('click','.createChecklistButton', function(){
	$('.edit-page').show();
	Meteor.call('checklists.create');
	currentCheckList = CheckListCollection.findOne({}, {sort: {DateTime: -1, limit: 1}})._id;
	$('.createChecklistButton').hide();
}); */
