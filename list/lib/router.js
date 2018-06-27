Router.configure({
	layoutTemplate: 'main_layout'
});

Router.route('/', {
	name:'Home',
	template:'Home',
  waitOn: function() {
    // Client
    return Meteor.subscribe('userData');  
  },
    action: function() {
      if(this.ready()) {
        this.render();
      }
  },
});

Router.route('/create', {
  name:'Create',
  template:'create_checklist',
  subscriptions: function() {
      Meteor.subscribe("tasks");
      Meteor.subscribe("checklists");
  },
    action: function() {
      if(this.ready()) {
        this.render();
      }
  },

});

Router.route('/create_account', {
  name:'Create Account',
  template:'create_account',
    action: function() {
      if(this.ready()) {
        this.render();
      }
  },
});

Router.route('/categories', {
	name:'Categories',
	template:'mainCategory',
});

Router.route('/categories/Programming', {
      	name: 'Programming',
  	template: 'checklists',
  		waitOn: function() {
        return Meteor.subscribe('checklists');
    },
    action: function() {
      if(this.ready()) {
        this.render();
      }
  },
});

Router.route('/categories/art', {
    	name: 'Art',
  	template: 'checklists',
  	 waitOn: function() {
        return Meteor.subscribe('checklists');
    },
    action: function() {
      if(this.ready()) {
        this.render();
      }
  },
});

Router.route('/categories/photography', {
  	name: 'Photography',
  	template: 'checklists',
  	 waitOn: function() {
        return Meteor.subscribe('checklists');
    },
    action: function() {
      if(this.ready()) {
        this.render();
      }
  },
});

Router.route('/categories/music', {
	name: 'Music',
  	template: 'checklists',
  	 waitOn: function() {
        return Meteor.subscribe('checklists');
    },
    action: function() {
      if(this.ready()) {
        this.render();
      }
  },
});

Router.route('/checklist/:_id', {
  name: 'Checklist',
    template: 'checklist-page',
    waitOn: function() {
      Session.set('current-checklist', this.params._id);
        return [Meteor.subscribe('tasks-specific', this.params._id),
       			Meteor.subscribe('checklists-specific', this.params._id),
       			Meteor.subscribe('posts-specific', this.params._id),]
    },
    action: function() {
      if(this.ready()) {
        this.render();
      }
    },
});