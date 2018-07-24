Router.configure({
  layoutTemplate: 'external'
});

// Simple Routes Config.
Router.route('/', function () {
	this.render('main');

	}, {
	name: 'main'
});

Router.route('/login', function () {

  this.render('login');
});

Router.route('/create_account', function () {
	
  this.render('create_account');
});

Router.route('/forgot_password', function () {
	
  this.render('forgot_password');
});


// Router.route('/login', {
// 	name:'Login',
// 	template:'Login',
//   // waitOn: function() {
//   //   // Client
//   //   return Meteor.subscribe('userData');
//   // },
//     action: function() {
//       if(this.ready()) {
//         this.render();
//       }
//   },
// });


// Router.route('/', function () {
// 	name: 'Main',
//   this.render('main_layout');
// });
// Router.route('/', function () {
// 	layoutTemplate: "external",
//   this.render('cover');
// });


Router.route('/change_password', function () {
  this.render('change_password');
});

Router.route('/email', function () {
	this.render('email');
});



Router.route('/reset_password', function () {
  this.render('reset_password');
});



// Router.route('/', {
// 	name:'Home',
// 	template:'Home',
//   waitOn: function() {
//     // Client
//     return Meteor.subscribe('userData');
//   },
//     action: function() {
//       if(this.ready()) {
//         this.render();
//       }
//   },
// });

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

// Router.route('/create_account', {
//   name:'Create Account',
//   template:'create_account',
//     action: function() {
//       if(this.ready()) {
//         this.render();
//       }
//   },
// });

// Router.route('/categories', {
// 	this.layout('dashboard');
// 	name:'Categories',
// 	template:'mainCategory',
// });

// Router.route('/categories', function () {
// 	this.layout('dashboard');
// 	}, {
// 	name: 'Categories',
// 	template:'mainCategory',
// });

Router.route('/categories', {
      	name: 'Categories',
  	template: 'mainCategory',
    action: function() {
      if(this.ready()) {
        
        this.render();
      }
  },
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

Router.route('/home/user-checklists', {
  name: 'User Checklists',
    template: 'userChecklists',
     waitOn: function() {
        return [Meteor.subscribe('checklists-user'),
        Meteor.subscribe('saved-checklists-user')]
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

Router.route('/saved-checklist/:_id', {
  name: 'Saved Checklist',
    template: 'savedChecklist',
    waitOn: function() {
      Session.set('current-saved-checklist', this.params._id);
        return [Meteor.subscribe('saved-tasks-specific', this.params._id),
            Meteor.subscribe('saved-checklists-specific', this.params._id),]
    },
    action: function() {
      if(this.ready()) {

        this.render();
      }
    },
});

Router.route('/saved-checklist/:_id/edit', {
    name: 'Edit Checklist',
    template: 'editExistingChecklist',
    waitOn: function() {
        return [Meteor.subscribe('saved-tasks-specific', this.params._id),
            Meteor.subscribe('saved-checklists-specific', this.params._id),]
    },
    action: function() {
      if(this.ready()) {
        
        this.render();
      }
    },
});

Router.route('/checklist/:_id/edit', {
    name: 'Edit Created Checklist',
    template: 'editCreatedChecklist',
    waitOn: function() {
        return [Meteor.subscribe('tasks-specific', this.params._id),
            Meteor.subscribe('checklists-specific', this.params._id),]
    },
    action: function() {
      if(this.ready()) {
        this.render();
      }
    },
});


