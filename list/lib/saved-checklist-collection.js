import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'


export const SavedChecklistCollection = new Mongo.Collection('saved-checklists');

if(Meteor.isClient){

}


if(Meteor.isServer){
Meteor.publish("saved-checklists", function(type){
		return SavedChecklistCollection.find();
});

Meteor.publish("saved-checklists-user", function(){
		return SavedChecklistCollection.find({userId: this.userId});
});

Meteor.publish("saved-checklists-specific", function(id){
	return SavedChecklistCollection.find({_id: id});
});
}


	Meteor.methods({
	'saved-checklists.create'(name, cat, c_id, c_name, u_id) {
		console.log(Meteor.users.find().fetch().username);
		SavedChecklistCollection.insert({
			listName: name,
			category: cat,
			creatorId: c_id,
			creatorName: c_name,
			userId: u_id,
			createdAt: new Date(),
		});
	},
	'saved-checklists.remove'(list) {
		SavedChecklistCollection.remove({_id: list._id});
	},
	'saved-checklists.update'(id, name, cat){
				SavedChecklistCollection.update({_id: id}, {$set: 
			{
			listName: name,
			category: cat,
		}}, { upsert:true});
	}
});


