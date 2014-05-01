username = "newbyca";
Users = new Meteor.Collection('users');
Lists = new Meteor.Collection('lists');
Tasks = new Meteor.Collection('tasks');
  
if (Meteor.isClient) {

  Template.home.lists = function () {
    return Lists.find({owner: username}, {sort: {sort: 1, date: -1}});
  };

  Template.home.rendered = function(){
    var text = $('input[type=text]');
    var lists = $('#lists');
    text.keypress(function(e){
      if(e.which == 13){
        addList();
      }
    });
    lists.sortable({
      opacity: 0.75,
      placeholder: 'placeholder',
      update: function(e, o){
        var lis = $('#lists li');
        for(var i=0, max=lis.length; i < max; i++){
          var li = $(lis[i]);
          var id = li.attr('id');
          Lists.update({'_id': id}, {$set: {sort: i}});
        }
      }
    });
    text.focus();
  };

  function addList(){
    var text = $('input[type=text]');
    var list = {
      owner: username,
      text: text.val(),
      date: new Date(),
      sort: 0
    };
    Lists.insert(list);
    text.val('');
  }

  Template.list.events({
    'click li .actions span:nth-child(1)': function (e, template) {
      var list = this;
      if(!list.fixed){
        $(template.find('li')).fadeOut('fast', function(){
          Tasks.find({list: list._id}).forEach(function(task){
            Tasks.remove(task._id);
          });
          Lists.remove(list._id);
        });
      }
    }
  });

  Template.tasklist.tasks = function () {
    return Tasks.find(
      {list: this._id},
      {sort: {sort: 1, date: -1}}
    );
  };

  Template.tasklist.rendered = function(){
    var text = $('input[type=text]');
    var tasks = $('#tasks');
    text.keypress(function(e){
      if(e.which == 13){
        addTask();
      }
    });
    tasks.sortable({
      opacity: 0.75,
      placeholder: 'placeholder',
      update: function(e, o){
        var lis = $('#tasks li');
        for(var i=0, max=lis.length; i < max; i++){
          var li = $(lis[i]);
          var id = li.attr('id');
          Tasks.update({'_id': id}, {$set: {sort: i}});
        }
      }
    });
    text.focus();
  };

  function addTask(){
    var list = $('#list').val();
    var text = $('input[type=text]');
    var task = {
      list: list,
      text: text.val(),
      date: new Date(),
      sort: 0
    };
    Tasks.insert(task);
    text.val('');
  }

  Template.task.events({
    'click li .actions span:nth-child(1)': function (e, template) {
      var task = this;
      $(template.find('li')).fadeOut('fast', function(){
        Tasks.remove(task._id);
      });
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var firstUser = Users.findOne({username: username});
    if(firstUser == null){

      Users.insert({username: username});

      var firstList = {
        owner: username,
        text: username,
        fixed: true,
        sort: 0,
        date: new Date()
      };
      Lists.insert(firstList, function(e, id){
        firstList._id = id;
        Tasks.insert({list: id, text: 'Take', sort: 0});
        Tasks.insert({list: id, text: 'My', sort: 1});
        Tasks.insert({list: id, text: 'Wife', sort: 2});
      });
    }
  });
}

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