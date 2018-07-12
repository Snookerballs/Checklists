import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const Tasks = new Mongo.Collection('tasks');

if(Meteor.isClient){

}

if(Meteor.isServer){
Meteor.publish("tasks", function(){
	return Tasks.find();
});

Meteor.publish("tasks-specific", function(id) {
	return Tasks.find({checklistID: id}, {sort: { createdAt: 1}});
});
}

	Meteor.methods({
	'tasks.insert'(name, des, res, id) {
		Tasks.insert({
			taskName: name,
			taskDescription: des,
			taskResources: res,
			checklistID: id,
			createdAt: new Date(),
		});
	},
	'tasks.remove'(checklist) {
		Tasks.remove({checklistID: checklist});
	},

	'tasks.update'(id, name, des, res) {
		Tasks.insert({
			taskName: name,
			taskDescription: des,
			taskResources: res,
			checklistID: id,
			createdAt: new Date(),
		});
	}
})
