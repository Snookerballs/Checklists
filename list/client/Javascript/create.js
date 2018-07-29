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
var tempResourcesArr = [];

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

	$(document).on('click','#create-edit-task', function(){
	$('#edit-task-modal').modal({
		dismissible: false,
	});
	$('#edit-task-modal').modal('open');

	var editingTask = $(this).parent().closest('li').attr('class').split(' ');
	var taskNum = editingTask[0];
	var name = $('.'+taskNum).find('.name').text();
	var description = $('.'+taskNum).find('.description').text();

	$('#editTaskName').val(name);
	$('#editDescription').val(description);


	taskToUpdate = ChecklistInCreation.find({taskName: name,
		taskDescription: description}).fetch()[0];
	var resources = taskToUpdate.taskResources;
				for(var i = 0; i < resources.length; i++){
					$(".editResourceList").append('<li class="'
 				+i
 				+'""><a href="'
 				+ resources[i].link
 				+ '"<span class="resource-item">'
 				+ resources[i].name + '</span></a>'
 				+ '<i class="material-icons task-resource-delete" id="create-task-resource-delete">close</i>'
 				+ '</li>' );
				}
	//BUG: .val() does not copy over html formatting ><
});

$(document).ready(function(){
				$(document).on('click','.resource-delete', function(){
		var resourceToDelete = $(this).parent().closest('li').attr('class').split(' ');
		tempResourcesArr.splice(Number(resourceToDelete), 1);
		$("." + resourceToDelete).remove();
		console.log(tempResourcesArr);
				});
						$(document).on('click','#create-task-resource-delete', function(){
var resourceToDelete = $(this).parent().closest('li').attr('class').split(' ');
//Update relavant information
ChecklistInCreation.update({index: taskToUpdate.index}, { $pull:
{"taskResources": {index: Number(resourceToDelete)
}}}, { upsert:true});
$("." + resourceToDelete).remove();
console.log(tempResourcesArr);
				});
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
});

$(".resource-form").validate({
rules: {
			resourceName: {
			required:true,
	},
	resourceLink: {
			required: true,
			url: true,

	},
},
messages: {
	resourceName: {
			required: "A Resource name is required.",
	},
	resourceLink:  {
			required: "Link is required.",
			url: "Please Enter a Valid URL",

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
});
$(".resource-form").validate({
rules: {
			resourceName: {
			required:true,
	},
	resourceLink: {
			required: true,
			url: true,

	},
},
messages: {
	resourceName: {
			required: "A Resource name is required.",
	},
	resourceLink:  {
			required: "Link is required.",
			url: "Please Enter a Valid URL",

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
		tempResourcesArr = [];
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
				Meteor.call('accounts.incrementCreatedCounter');

		//BUG TESTING
		console.log(ChecklistCollection.find().fetch());
		console.log(Tasks.find().fetch());
		$('#modalUX1').modal('open');
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

		//Add task to ChecklistInCreation
		ChecklistInCreation.insert({
			taskName: taskNameVar,
			taskDescription: descriptionVar,
			taskResources: taskResourcesArr,
			index: size,
		});
		size = size+1;

		//Reset text in Add Task Form
		event.target.taskName.value = ' ';
		event.target.description.value = ' ';
		tempResourcesArr = [];
		$(".resourceList li").remove();
		$('.collapsible').collapsible();
		$('#add-form').trigger("reset");
	},

	'submit .resource-form': function() {
			event.preventDefault();
			nameVar = event.target.resourceName.value;
			linkVar = event.target.resourceLink.value;
			tempResourcesArr.push({
				index: tempResourcesArr.length,
				name: nameVar,
				link: linkVar,
			});
			console.log(tempResourcesArr);
			var index = tempResourcesArr.length-1;
 			$(".resourceList").append('<li class="'
 				+index
 				+'""><a href="'
 				+ linkVar
 				+ '"<span class="resource-item">'
 				+ nameVar + '</span></a>'
 				+ '<i class="material-icons resource-delete">close</i>'
 				+ '</li>' );
 			event.target.resourceName.value = "";
			event.target.resourceLink.value = "";
	},

});

Template.editTaskForm.events({
	'submit .edit-form': function() {
		event.preventDefault();
		//Retrieve Information in the textboxes
		var taskNameVar = event.target.editTaskName.value;
		var descriptionVar = event.target.editDescription.value;

		//Update relavant information
		ChecklistInCreation.update({index: taskToUpdate.index}, { $set:
			{
			taskName: taskNameVar,
			taskDescription: descriptionVar,
		}}, { upsert:true});
		$('#edit-form').trigger("reset");
		$(".modal").modal('close');
		 			$(".editResourceList li").remove();
	},

	'submit .resource-form': function() {
		event.preventDefault();
		var nameVar = event.target.resourceName.value;
		var linkVar = event.target.resourceLink.value;

		var i = taskToUpdate.taskResources.length;
		ChecklistInCreation.update({index: taskToUpdate.index}, { $push:
		{"taskResources": {
			index: i,
			name: nameVar,
			link: linkVar,
	}}}, { upsert:true});


		$(".editResourceList").append('<li class="'
			+i
			+'""><a href="'
			+ linkVar
			+ '"<span class="resource-item">'
			+ nameVar + '</span></a>'
			+ '<i class="material-icons resource-delete">close</i>'
			+ '</li>' );
		event.target.resourceName.value = "";
		event.target.resourceLink.value = "";


},

});






/*
$(document).on('click','.createChecklistButton', function(){
	$('.edit-page').show();
	Meteor.call('checklists.create');
	currentCheckList = CheckListCollection.findOne({}, {sort: {DateTime: -1, limit: 1}})._id;
	$('.createChecklistButton').hide();
}); */
