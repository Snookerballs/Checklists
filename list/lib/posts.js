import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const Posts = new Mongo.Collection('posts');

if(Meteor.isClient){

}

if(Meteor.isServer){
Meteor.publish("posts-specific", function(id){
	return Posts.find({checklistID: id}, {sort:{createdAt: -1}});
});
}

Meteor.methods({
	'posts.insert'(post, id, poster, posterName) {
		Posts.insert({
			comment: post,
			checklistID: id,
			posterId: poster,
			username: posterName,
			createdAt: new Date(),
		});
	},
	'post.remove'(task) {
		Posts.remove(task._id);
	},
});
