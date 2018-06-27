import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

import '../html/login.html';
import '../html/create_account.html';


  Template.create_account.events({
  'submit form': function(event){
      event.preventDefault();
      console.log(Meteor.users.find().fetch());
      var emailVar = event.target.registerEmail.value;
      var passwordVar = event.target.registerPassword.value;
      var registerUsernameVar = event.target.registerUsername.value;
      Accounts.createUser({
          username: registerUsernameVar,
          email: emailVar,
          password: passwordVar
      },function(error){
    if(error){
        alert(error.reason); // Output error if registration fails
    } else {
        console.log(Meteor.userId());
        Router.go("Home"); // Redirect user if registration succeeds
    }
});
    
    }
  });

  Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        console.log("WORKS");
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar, function(err) {
  if (err) {
    alert( err.message);
  }
});
    }
  });

  Template.dashboard.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        console.log("logout alr");
    }
  });

Template.login.onRendered(function(){
$("#login-form").validate({
  rules: {
        loginUsername: {
        required:true,
    },
    loginEmail: {
        required: true,

    },
    loginPassword: {
        required: true,

    },
  },
messages: {
    loginUsername: {
        required: "Username cannot be blank",
    },
    loginEmail: {
        required: "Email cannot be blank",

    },
    loginPassword: {
        required: "Password cannot be blank",

    },
},
    errorElement : 'div',
    errorPlacement: function(error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {
        error.insertAfter(element);
      }
    }
});
});

Template.create_account.onRendered(function(){
$("#register-form").validate({
  rules: {
        registerUsername: {
        required:true,
    },
    registerEmail: {
        required: true,

    },
    registerPassword: {
        required: true,
        minlength: 6,

    },
    confirmPassword: {
      required: true,
      equalTo: "#registerPassword",
    }
  },
messages: {
    registerUsername: {
        required: "Username cannot be blank",
    },
    registerEmail: {
        required: "Email cannot be blank",

    },
    registerPassword: {
        required: "Password cannot be blank",
        minlength: "Password must be at least 6 characters long",

    },
    confirmPassword: {
      required: "Password cannot be blank",
      equalTo: "Does not match password",
    }
},
    errorElement : 'div',
    errorPlacement: function(error, element) {
      var placement = $(element).data('error');
      if (placement) {
        $(placement).append(error)
      } else {
        error.insertAfter(element);
      }
    }
})
})