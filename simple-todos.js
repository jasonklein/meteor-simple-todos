Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({});
    }
  });

  Template.body.events({
    "submit .new-task": function (ev) {
      ev.preventDefault();

      var text = ev.target.text.value;

      Tasks.insert({
        text: text,
        createdAt: new Date()
      });

      ev.target.text.value = '';
    }
  });
}