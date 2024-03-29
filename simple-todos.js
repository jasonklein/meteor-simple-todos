Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
      } else {
        return Tasks.find({}, { sort: { createdAt: -1 } } );
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Tasks.find({ checked: { $ne: true } }).count();
    }
  });

  Template.body.events({
    "submit .new-task": function (ev) {
      ev.preventDefault();

      var text = ev.target.text.value;

      Tasks.insert({
        text: text,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username
      });

      ev.target.text.value = '';
    },
    "change .hide-completed input": function (ev) {
      Session.set("hideCompleted", ev.target.checked);
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      Tasks.update(this._id, {
        $set: { checked: ! this.checked }
      });
    },
    "click .delete": function() {
      Tasks.remove(this._id);
    }
  });

  Template.task.helpers({
    displayText: function () {
      return this.username ? "- " + this.text : this.text;
    }
  })

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}
