username = "newbyca";
Users = new Meteor.Collection('users');
Lists = new Meteor.Collection('lists');
Tasks = new Meteor.Collection('tasks');

Router.map(function() {
  this.route('home', {path: '/'})
  this.route('tasklist', {
    path: '/:username',
    data: function(){
      return Lists.findOne({owner: this.params.username, text: this.params.username});
    }
  })
  this.route('tasklist', {
    path: '/:username/:listname',
    data: function(){
      return Lists.findOne({owner: this.params.username, text: this.params.listname});
    }
  })
});