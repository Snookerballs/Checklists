import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { Tasks } from '../../lib/task.js';
import {ChecklistCollection} from '../../lib/checklist-collection.js';

import '../html/create.html'; 
import '../CSS/create.css';

var ChecklistInCreation = new Mongo.Collection(null);
var taskToUpdate;
var size = 0;
var isPublish = false;

/*------- LIST -------*/
Template.list.helpers({
	task(){
		return ChecklistInCreation.find({},{sort: {index:1}});
	},
});

Template.list.events({
	'click .delete-task': function() {
		ChecklistInCreation.remove(this);
	},
	'click .move-up': function() {
			var topInList = ChecklistInCreation.findOne({},{sort: {index: 1}});
			if(topInList._id != this._id){
		ChecklistInCreation.update({index: this.index-1},  {
			$set:{
				index: this.index,
		}}, { upsert:true});
						ChecklistInCreation.update({_id: this._id},  {
			$set:{
				index: this.index-1,
		}}, { upsert:true});
		}

	},
		'click .move-down': function() {
			var bottomInList = ChecklistInCreation.findOne({},{sort: {index: -1}});
			if(bottomInList._id != this._id){
		ChecklistInCreation.update({index: this.index+1},  {
			$set:{
				index: this.index,
		}}, { upsert:true});
						ChecklistInCreation.update({_id: this._id},  {
			$set:{
				index: this.index+1,
		}}, { upsert:true});
		}

	}
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

});

Template.addTaskForm.onRendered(function() {
	$("#add-form").validate({
  rules: {
        taskName: {
        required:true,
    },
    description: {
        required: true,

    },
  },
	messages: {
    taskName: {
        required: "Task name is required.",
    },
    description:  {
        required: "Description is required.",

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

Template.titleAndCategory.onRendered(function() {
		$('.dropdown-trigger').dropdown();
	$('select').material_select();
	$("#title-form").validate({
  rules: {
        checklistName: { //Sometimes not working
        required:true,
    },
    	checklistCategory: { //Not working wtf
        required: true,
    },
  },
	messages: {
    checklistName: {
        required: "Please give your checklist a name.",
    },
    checklistCategory:  {
        notEqual: "Please choose a category for your checklist",

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
})

Template.editTaskModal.onRendered(function() {

$("#edit-form").validate({
  rules: {
        editTaskName: {
        required:true,
    },
    	editDescription: {
        required: true,

    },
  },
	messages: {
    editTaskName: {
        required: "Task name is required.",
    },
    editDescription:  {
        required: "Description is required.",

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

})


Template.create_checklist.onDestroyed(function(){
	ChecklistInCreation.remove({});
	size = 0;
});

Template.create_checklist.events({
	'click .saveCheckListButton': function() {
		ChecklistInCreation.remove(this);
	}
});

Template.create_checklist.events({
	'submit .checklist-form': function() {
		event.preventDefault();

	console.log(isPublish)
		//Save variables to Checklist Collection
		var listName = event.target.checklistName.value;
		var category = $( "#checklistCategory option:selected" ).text();
		//Create checklist
		Meteor.call('checklists.create', listName, category, Meteor.userId(), Meteor.user().username, isPublish);
		var checklistId = ChecklistCollection.findOne({}, {sort: {createdAt: -1, limit: 1}})._id;

		//Add checklist task to task collections
		ChecklistInCreation.find({},{sort:{index: 1}}).forEach((task) => Meteor.call('tasks.insert', task.taskName, task.taskDescription,
			task.taskResources, checklistId));

		// Re Initialize ChecklistInCreation
		event.target.checklistName.value =' ';
		ChecklistInCreation.remove({});

		//Submit
		$('#title-form').trigger("reset");

		//BUG TESTING
		console.log(ChecklistCollection.find().fetch());
		console.log(Tasks.find().fetch());
	},
	'click #save-checklist-button': function() {
		isPublish = false;
	},
		'click #save-and-publish-checklist-button': function() {
		isPublish = true;
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
			index: size,
		});
		size = size+1;

		//Reset text in Add Task Form
		event.target.taskName.value = ' ';
		event.target.description.value = ' ';
		event.target.resources.value = ' ';

		$('.collapsible').collapsible();
		$('#add-form').trigger("reset");
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
		ChecklistInCreation.update({index: taskToUpdate.index}, { $set:
			{
			taskName: taskNameVar,
			taskDescription: descriptionVar,
			taskResources: taskResourcesVar,
		}}, { upsert:true});
		$('#edit-form').trigger("reset");
		$(".modal").modal('close');
	}
});






/*
$(document).on('click','.createChecklistButton', function(){
	$('.edit-page').show();
	Meteor.call('checklists.create');
	currentCheckList = CheckListCollection.findOne({}, {sort: {DateTime: -1, limit: 1}})._id;
	$('.createChecklistButton').hide();
}); */
