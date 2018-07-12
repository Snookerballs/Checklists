import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { Tasks } from '../../lib/task.js';
import {ChecklistCollection} from '../../lib/checklist-collection.js';

var size = 0;
var ChecklistToEdit = new Mongo.Collection(null);
var taskToUpdate;

Template.editCreatedChecklist.onRendered(function(){
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

	
	taskToUpdate = ChecklistToEdit.findOne({taskName: name, 
		taskDescription: description,
		taskResources: resources});
	//BUG: .val() does not copy over html formatting ><
});

	console.log(ChecklistToEdit.find().fetch());
})

Template.editCreatedChecklist.onDestroyed(function(){
	ChecklistToEdit.remove({});
	size = 0;
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

		// Re Initialize ChecklistInCreation
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
})
})

Template.editCreatedEditTaskModal.events({
	'submit .edit-form': function() {
		event.preventDefault();
		//Retrieve Information in the textboxes
		var taskNameVar = event.target.editTaskName.value;
		var descriptionVar = event.target.editDescription.value;
		var taskResourcesVar = event.target.editResources.value;
		
		//Update relavant information
		ChecklistToEdit.update({index: taskToUpdate.index}, { $set:
			{
			taskName: taskNameVar,
			taskDescription: descriptionVar,
			taskResources: taskResourcesVar,
		}}, { upsert:true});
		$('#edit-form').trigger("reset");
		$(".modal").modal('close');
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
})
});

Template.editCreatedAddTaskForm.events({
	'submit .add-form': function() {
		event.preventDefault();
		//Retrieve Information in the textboxes
		var taskNameVar = event.target.taskName.value;
		var descriptionVar = event.target.description.value;
		var taskResourcesVar = event.target.resources.value;

		//Add task to ChecklistInCreation
		ChecklistToEdit.insert({
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