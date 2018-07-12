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
	'saved-tasks.remove'(checklist) {
		SavedTasks.remove({checklistID: checklist});
	},

	'saved-tasks.update'(id, name, des, res) {
		SavedTasks.insert({
			taskName: name,
			taskDescription: des,
			taskResources: res,
			checklistID: id,
			checkStatus: false,
			createdAt: new Date(),
		});
	},
	'saved-tasks.check'(id, status) {
				SavedTasks.update({_id: id}, {$set: {
				checkStatus: status,
		}}, { upsert:true});
	}
})
