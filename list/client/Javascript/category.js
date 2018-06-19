import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import {ChecklistCollection} from '../../lib/checklist-collection.js';

import '../html/category.html'; 


Template.mainCategory.helpers({
	category(){
		return Categories.find();
	},

});

Template.checklists.helpers({
		checklist(){
		return ChecklistCollection.find({category:  Router.current().route.getName()});
	},
	});

Template.categoryShowcase.events({
		'click .category-link': function() {
		} 
})