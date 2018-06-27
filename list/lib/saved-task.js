import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const SavedTasks = new Mongo.Collection('saved-tasks');

if(Meteor.isClient){

}

if(Meteor.isServer){
Meteor.publish("saved-tasks", function(){
	return SavedTasks.find();
});

Meteor.publish("saved-tasks-specific", function(id) {
	return SavedTasks.find({checklistID: id}, {sort: { createdAt: 1}});
});
}

	Meteor.methods({
	'saved-tasks.insert'(name, des, res, id) {
		SavedTasks.insert({
			taskName: name,
			taskDescription: des,
			taskResources: res,
			checklistID: id,
			checkStatus: false,
			createdAt: new Date(),
		});
	},
	'saved-tasks.remove'(task) {
		SavedTasks.remove(task._id);
	},

	'saved-tasks.update'(id, name, des, res) {
		SavedTasks.update({_id: id}, {$set: 
			{
			taskName: name,
			taskDescription: des,
			taskResources: res,
		}}, { upsert:true});
	},
	'saved-tasks.check'(status) {
				SavedTasks.update({_id: id}, {$set: {
				check: status,
		}}, { upsert:true});
	}
})
