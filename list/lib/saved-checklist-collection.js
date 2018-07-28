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
		SavedChecklistCollection.insert({
			listName: name,
			category: cat,
			creatorId: c_id,
			creatorName: c_name,
			userId: u_id,
			completionPercentage: 0.0,
			completionStatus: false,
			timesCompleted: 0,
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
			completionPercentage: 0.0,
		}}, { upsert:true});
	},
	'saved-checklist.updateCompletionPercentage'(id, percentage){
						SavedChecklistCollection.update({_id: id}, {$set: 
			{
				completionPercentage: percentage,
		}}, { upsert:true});
	},
	'saved-checklist.setCompletionStatus'(id){
								SavedChecklistCollection.update({_id: id}, {$set: 
			{
				completionStatus: true,
		}}, { upsert:true});
	},
	'saved-checklist.incrementTimesCompleted'(id){
		var timesCompletedVar = SavedChecklistCollection.findOne({_id:id}).timesCompleted +1;
										SavedChecklistCollection.update({_id: id}, {$set: 
			{
				timesCompleted: timesCompletedVar,
		}}, { upsert:true});

	},
	'saved-checklist.resetChecklist'(id) {
		SavedChecklistCollection.update({_id: id}, {$set: 
			{
				completionStatus: false,
				completionPercentage: 0.0,
		}}, { upsert:true});
	}
});


