import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { CheckListCollection } from '../lib/checklist.js';

export const Tasks = new Mongo.Collection('tasks');

/*if(Meteor.isClient){
console.log("Hello World");
}*/

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
	'tasks.remove'(task) {
		Tasks.remove(task._id);
	},

	'tasks.update'(id, name, des, res) {
		Tasks.update({_id: id}, {
			taskName: name,
			taskDescription: des,
			taskResources: res,
		}, { upsert:true});
	}
})