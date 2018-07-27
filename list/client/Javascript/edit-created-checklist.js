import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { Tasks } from '../../lib/task.js';
import {ChecklistCollection} from '../../lib/checklist-collection.js';

var size = 0;
var ChecklistToEdit = new Mongo.Collection(null);
var taskToUpdate;
var tempResourcesArr = [];

Template.editCreatedChecklist.onRendered(function(){
	//$('.collapsible-header').click(function(e){ e.stopPropagation();});
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
	//$('.collapsible-header').click(function(e){ e.stopPropagation();});

	//Transfer to temporary collection

	Tasks.find({},{sort:{index: 1}}).forEach((task) => 
		ChecklistToEdit.insert({
			taskName: task.taskName,
			taskDescription: task.taskDescription,
			taskResources: task.taskResources,
			index: size++,
			id: task._id,
		}))


	$('#editCreatedChecklist').on('click','.editTask', function(){
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



		taskToUpdate = ChecklistToEdit.findOne({taskName: name, 
			taskDescription: description});
		var resources = taskToUpdate.taskResources;
		for(var i = 0; i < resources.length; i++){
			$(".editResourceList").append('<li class="'
				+i
				+'""><a href="' 
				+ resources[i].link
				+ '"<span class="resource-item">'
				+ resources[i].name + '</span></a>'
				+ '<i class="material-icons task-resource-delete">close</i>'
				+ '</li>' );
		}
	//BUG: .val() does not copy over html formatting ><
});
	$('#editCreatedChecklist').ready(function(){
		$(document).on('click','.resource-delete', function(){
			var resourceToDelete = $(this).parent().closest('li').attr('class').split(' ');
			tempResourcesArr.splice(Number(resourceToDelete), 1);
			$("." + resourceToDelete).remove();
			console.log(tempResourcesArr);
		});
	}); 

	$('#editCreatedChecklist').ready(function(){
		$('#editCreatedChecklist').on('click','.task-resource-delete', function(){
			var resourceToDelete = $(this).parent().closest('li').attr('class').split(' ');
	    	//Update relavant information
	    	ChecklistToEdit.update({index: taskToUpdate.index}, { $pull:
	    		{"taskResources": {index: Number(resourceToDelete)
	    		}}}, { upsert:true});
	    	$("." + resourceToDelete).remove();
	    	console.log(tempResourcesArr);
	    });
	});    

	console.log(ChecklistToEdit.find().fetch());
})

Template.editCreatedChecklist.onDestroyed(function(){
	ChecklistToEdit.remove({});
	size = 0;
	tempResourcesArr = [];
	console.log("TRUE");
});

Template.editCreatedChecklist.events({
	'submit .checklist-form': function() {
		event.preventDefault();

		//Save variables to Checklist Collection
		var listName = event.target.checklistName.value;
		var category = $( "#checklistCategory option:selected" ).text();

		//Create checklist
		Meteor.call('checklists.update', Router.current().params._id, listName, category);

		Meteor.call('tasks.remove', Router.current().params._id);
		//Add checklist task to task collections
		ChecklistToEdit.find({},{sort:{index: 1}}).forEach((task) => Meteor.call('tasks.update', Router.current().params._id, task.taskName, 
			task.taskDescription, task.taskResources));

		// Re Initialize ChecklistToEdit
		event.target.checklistName.value =' ';
		Router.go("Checklist", {_id: Router.current().params._id});
		//BUG TESTING
		console.log(ChecklistCollection.find().fetch());
		console.log(Tasks.find().fetch());
	},
})

Template.editCreatedTitleAndCategory.onRendered(function(){
	var checklist = ChecklistCollection.findOne();
	console.log(checklist);
	$('#checklistName').val(checklist.listName);
	$('#checklistCategory option').filter(function() {
		return $(this).text() == checklist.category;
	}).prop('selected', true);
})

Template.editCreatedList.helpers({
	task(){
		return ChecklistToEdit.find({},{sort:{index:1}});
	},
})
Template.editCreatedList.events({
	'click .delete-task': function() {
		ChecklistToEdit.remove(this);
	},
	'click .move-up': function() {
		var topInList = ChecklistToEdit.findOne({},{sort: {index: 1}});
		if(topInList._id != this._id){
			ChecklistToEdit.update({index: this.index-1},  {
				$set:{
					index: this.index,
				}}, { upsert:true});
			ChecklistToEdit.update({_id: this._id},  {
				$set:{
					index: this.index-1,
				}}, { upsert:true});
		}
	},
	'click .move-down': function() {
		var bottomInList = ChecklistToEdit.findOne({},{sort: {index: -1}});
		if(bottomInList._id != this._id){
			ChecklistToEdit.update({index: this.index+1},  {
				$set:{
					index: this.index,
				}}, { upsert:true});
			ChecklistToEdit.update({_id: this._id},  {
				$set:{
					index: this.index+1,
				}}, { upsert:true});
		}

	}
})

Template.editCreatedEditTaskModal.onRendered(function() {
	$('.modal').modal();

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

Template.editCreatedEditTaskModal.events({
	'submit .edit-form': function() {
		event.preventDefault();
		//Retrieve Information in the textboxes
		var taskNameVar = event.target.editTaskName.value;
		var descriptionVar = event.target.editDescription.value;
		
		//Update relavant information
		ChecklistToEdit.update({index: taskToUpdate.index}, { $set:
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
			console.log("TRUE");
			var nameVar = event.target.resourceName.value;
			var linkVar = event.target.resourceLink.value;

			var i = taskToUpdate.taskResources.length;
			ChecklistToEdit.update({index: taskToUpdate.index}, { $push:
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


/*------- TASK FORMS -------*/

Template.editCreatedAddTaskForm.onRendered(function() {
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

Template.editCreatedAddTaskForm.events({
	'submit .add-form': function() {
		event.preventDefault();
		//Retrieve Information in the textboxes
		var taskNameVar = event.target.taskName.value;
		var descriptionVar = event.target.description.value;


		//Add task to ChecklistToEdit
		ChecklistToEdit.insert({
			taskName: taskNameVar,
			taskDescription: descriptionVar,
			taskResources: tempResourcesArr,
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
		console.log("FALSE");
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