import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import {ChecklistCollection} from '../../lib/checklist-collection.js';
import {SavedChecklistCollection} from '../../lib/saved-checklist-collection.js';

Template.userChecklists.helpers({
	createdChecklist(){
		return ChecklistCollection.find();
	},
	savedChecklist(){
		return SavedChecklistCollection.find();
	},
		      formatDate(date){
  		return moment(date).format('DD-MM-YYYY');
    }
})

Template.userChecklists.onRendered(function(){
	$('select').material_select();
	  $('#select-options').on('change', function(e) {
    	$('#select-options').trigger('select');
  });
	    $(document).ready(function(){
    $('.tabs').tabs();
  });
})