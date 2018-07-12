import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'


export const ChecklistCollection = new Mongo.Collection('checklists');

if(Meteor.isClient){

}


if(Meteor.isServer){
Meteor.publish("checklists", function(type){
		return ChecklistCollection.find({publish: true});
});

Meteor.publish("checklists-user", function(){
		return ChecklistCollection.find({userId: this.userId});
});

Meteor.publish("checklists-specific", function(id){
	return ChecklistCollection.find({_id: id});
});
}

	Meteor.methods({
	'checklists.create'(name, cat, user, creatorName, status) {
		ChecklistCollection.insert({
			listName: name,
			category: cat,
			userId: user,
			username: creatorName,
			rating: 0,
			raters:0,
			publish: status,
			createdAt: new Date(),
		});
	},
	'checklists.remove'(list) {
		ChecklistCollection.remove({_id: list._id}); 
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
		'checklists.publish'(list){
		ChecklistCollection.update({_id: list._id}, {
			$set:{
			publish: true,
		}}, { upsert:true});
	},
		'checklists.update'(id, name, cat){
				ChecklistCollection.update({_id: id}, {$set: 
			{
			listName: name,
			category: cat,
		}}, { upsert:true});
	}
});


