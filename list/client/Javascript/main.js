import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

import '../html/main.html'; 

Template.side.onRendered(function(){
    $('.sidenav').sideNav();
});
