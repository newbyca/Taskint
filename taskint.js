Tasks = new Meteor.Collection('tasks');
  
if (Meteor.isClient) {

  Template.main.tasks = function () {
    return Tasks.find({}, {sort: {sort: 1, date: -1}});
  };

  Template.main.rendered = function(){
    var text = $('input[type=text]');
    var tasks = $('#tasks');
    text.keypress(function(e){
      if(e.which == 13){
        add();
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

  function add(){
    var text = $('input[type=text]');
    var task = {
      text: text.val(),
      date: new Date()
    };
    Tasks.insert(task);
    text.val('');
  }

  Template.task.events({
    'click li span:nth-child(2)': function (e, template) {
      var task = this;
      $(template.find('li')).fadeOut('fast', function(){
        Tasks.remove(task._id);
      });
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}