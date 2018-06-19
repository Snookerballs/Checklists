import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { CheckList } from '../lib/checklist.js';

export const ChecklistCollection = new Mongo.Collection('checklists');

Meteor.methods({
	'checklists.create'(name, cat) {
		ChecklistCollection.insert({
			listName: name,
			category: cat,
			createdAt: new Date(),
			//user id
		});
	},
	'checklists.remove'(list) {
		Meteor.call(tasks.deleteAllTasksFromChecklist(list._id));
		ChecklistCollection.remove(list._id);
	},

})

