import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'


export const ChecklistCollection = new Mongo.Collection('checklists');

if(Meteor.isClient){

}


if(Meteor.isServer){
Meteor.publish("checklists", function(type){
		return ChecklistCollection.find();
});

Meteor.publish("checklists-specific", function(id){
	return ChecklistCollection.find({_id: id});
});
}

	Meteor.methods({
	'checklists.create'(name, cat, user, creatorName) {
		console.log(Meteor.users.find().fetch().username);
		ChecklistCollection.insert({
			listName: name,
			category: cat,
			userId: user,
			username: creatorName,
			rating: 0,
			raters:0,
			createdAt: new Date(),
			//user id
		});
	},
	'checklists.remove'(list) {
		Meteor.call(tasks.deleteAllTasksFromChecklist(list._id));
		ChecklistCollection.remove(list._id);
	},
	'checklists.updateRating'(id, score){
		var list = ChecklistCollection.findOne({_id: id});


		var newRating = list.rating*list.raters;
		var newRaters = list.raters;


		newRating += score;

		newRaters +=1;
		newRating = newRating/newRaters;

		console.log("raters: " + newRaters )
		ChecklistCollection.update({_id: id}, {
			$set:{
			rating: newRating,
			raters: newRaters,
		}}, { upsert:true});
	},
});


