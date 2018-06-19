Router.configure({
	layoutTemplate: 'main_layout'
});

Router.route('/', {
	name:'Create',
	template:'create_checklist',
});

Router.route('/categories', {
	name:'Categories',
	template:'mainCategory'
});

Router.route('/categories/programming', {
      	name: 'Programming',
  	template: 'checklists'
});

Router.route('/categories/art', {
    	name: 'Art',
  	template: 'checklists'
});

Router.route('/categories/photography', {
  	name: 'Photography',
  	template: 'checklists'
});

Router.route('/categories/music', {
	name: 'Music',
  	template: 'checklists',
});