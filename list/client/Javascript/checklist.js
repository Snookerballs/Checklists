import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { Tasks } from '../../lib/task.js';
import {ChecklistCollection} from '../../lib/checklist-collection.js';
import {Posts} from '../../lib/posts.js';

import '../html/checklist.html'; 

$(document).ready(function(){

});

/*------- LIST -------*/
Template.checklist.helpers({

	task() {
		 	return Tasks.find();
		 },
    name() {
    	return ChecklistCollection.findOne().listName;
    },
    creator(){
    	return ChecklistCollection.findOne().username;
    },
    listRating(){
    	return ChecklistCollection.findOne().rating.toFixed(2);
    },
    raterNumber(){
		return ChecklistCollection.findOne().raters;
    },
});


Template.checklist.onRendered(function(){
		/** Initialize  Components **/
	$('.collapsible').collapsible();

	//$('.collapsible-header').click(function(e){ e.stopPropagation();});
});

Template.rating.onRendered(function(){
		/** Initialize  Components **/
		if(ChecklistCollection.findOne().userId == Meteor.userId()){
			$('#rate-button').prop('disabled','disabled');
	 }


	$(".ratingSystem").validate({
  rules: {
        starContainer: {
        required:true,
    },
  },
	messages: {
    	starContainer: {
        required: "You have not rated!.",
    },
},
    errorElement : 'div',
    errorPlacement: function(error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {
        error.insertAfter(element);
      }
    }
})
});

Template.comments.events({
	'submit .commentForm': function() {
		event.preventDefault();
		var comment = event.target.comment.value;
		Meteor.call('posts.insert', comment, Session.get('current-checklist'), Meteor.userId(), Meteor.user().username);
		event.target.comment.value = '';
	}
});

Template.comments.helpers({
    post() {
    	return Posts.find();
    },
        formatDate(date){
  		return moment(date).format('DD-MM-YYYY, HH:mm');
    }

});

Template.rating.events({
	'click #one': function() {
		$('.star').css("color", 'grey');
		$("#star-one").css("color", "#FD4");
	},
	'click #two': function() {
		$('#one').trigger('click');
		$("#star-two").css("color", "#FD4");
		$("#two").prop("checked", true);
	},	
	'click #three': function() {
		$('#two').trigger('click');
		$("#star-three").css("color", "#FD4");
		$("#three").prop("checked", true);
	},	
	'click #four': function() {
		$('#three').trigger('click');
		$("#star-four").css("color", "#FD4");
		$("#four").prop("checked", true);
	},	
	'click #five': function() {
		$('#four').trigger('click');
		$("#star-five").css("color", "#FD4");
		$("#five").prop("checked", true);
	},
		'submit .rating-system': function() {
			event.preventDefault();
			var score =Number($('input[name=starContainer]:checked').val());
			console.log(score);
			if(isNaN(score)) {
				console.log("this is a NaN");
			} else {
				Meteor.call('checklists.updateRating',Session.get('current-checklist'), score);
				$('.star').css("color", 'grey');
				$('input[name=star-container]:checked').attr('checked', false);
			}

	},
},

)