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