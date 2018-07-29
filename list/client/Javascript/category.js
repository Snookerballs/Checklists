import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import {ChecklistCollection} from '../../lib/checklist-collection.js';

import '../html/category.html';

Template.checklists.onRendered(function(){
	$('select').material_select();
	  $('#select-options').on('change', function(e) {
    	$('#select-options').trigger('select');
  });
	  Session.set('sort-type', 1);
})

Template.checklists.helpers({
		checklist(){
			//console.log(ChecklistCollection.find().fetch());
		if(Session.get('sort-type') == 2){
		return ChecklistCollection.find({category:  Router.current().route.getName()}, {sort: {createdAt: -1}});
		}else if(Session.get('sort-type') == 1){
			return ChecklistCollection.find({category:  Router.current().route.getName()}, {sort: {rating: -1}});
		} else if(Session.get('sort-type') == 3){
			return ChecklistCollection.find({category:  Router.current().route.getName()}, {sort: {rcreatedAt: 1}});
		}
	},
	      formatDate(date){
  		return moment(date).format('DD-MM-YYYY');
    }

	});

Template.categoryShowcase.events({
		'click .category-link': function() {
		}
})

Template.checklists.events({
		'click .list-name': function() {
			Session.set('checklist-id', this._id);
		},
		'select #select-options': function() {
			var sortType = $( "#select-options option:selected" ).val();
			Session.set('sort-type', sortType);
			return false;
		}
	});
