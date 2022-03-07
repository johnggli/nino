$(document).ready(function() {
  // Initialize Firebase
  var firebaseConfig = {
    apiKey: config.API_KEY,
    authDomain: config.AUTH_DOMAIN,
    databaseURL: config.DATABASE_URL,
    projectId: config.PROJECT_ID,
    storageBucket: config.STORAGE_BUCKET,
    messagingSenderId: config.MESSAGING_SENDER_ID,
    appId: config.APP_ID
  };
  firebase.initializeApp(firebaseConfig);


  // Configure brain
  var brainConfig = {
    iterations: 1000, // the maximum times to iterate the training data --> number greater than 0
    errorThresh: 0.005, // the acceptable error percentage from training data --> number between 0 and 1
    log: true, // true to use console.log, when a function is supplied it is used --> Either true or a function
    logPeriod: 1, // iterations between logging out --> number greater than 0
    learningRate: 0.6, // scales with delta to effect training rate --> number between 0 and 1
    momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
    callback: null, // a periodic call back that can be triggered while training --> null or function
    callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
    timeout: Infinity
  }


  // Authentication
  $('.login').submit(function(e) {
    e.preventDefault();
    $('.loading').show();
    var email = $('#login_email').val();
    var password = $('#login_password').val();
    
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      // An error happened.
      $('.loading').hide();
      var errorMessage = error.message;
      alert('Error: ' + errorMessage);
    });
  });

  $('.signup').submit(function(e) {
    e.preventDefault();
    $('.loading').show();
    var email = $('#signup_email').val();
    var password = $('#signup_password').val();
    
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      // ...
    })
    .catch((error) => {
      // An error happened.
      $('.loading').hide();
      var errorMessage = error.message;
      alert('Error: ' + errorMessage);
    });
  });

  $('.signup_link').click(function() {
    $('.login').hide();
    $('.signup').show();
  });

  $('.login_link').click(function() {
    $('.login').show();
    $('.signup').hide();
  });

  $('.logout_button').click(function() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      location.reload();
    }).catch((error) => {
      // An error happened.
      var errorMessage = error.message;
      alert('Error: ' + errorMessage);
    });
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      var uid = user.uid;
      var uemail = user.email;
      // console.log(uid);

      $('.userOptions span').text(uemail);
      
      $('.loading').show();
      $('.login').hide();
      $('.logged').show();

      helloWorld();

      function helloWorld() {
        var hello = $($('.hello_template').clone().html());

        $('.messages').append(hello);

        hello.addClass('appeared');

        $('.messages').animate({
          scrollTop: $('.messages').prop('scrollHeight')
        }, 300);
      }

      var botTalk = [];

      firebase.database().ref('users/' + uid + '/botTalk').on('value', function(snapshot) {
        botTalk = [];
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          botTalk.push(childData);
        });

        if (botTalk.length == 0) {
          var botTalkRef = firebase.database().ref('users/' + uid + '/botTalk');
          botTalkRef.push().set('hello world');
        }
      });

      //***********Machine learning**************
      var net = new brain.NeuralNetwork(brainConfig);
      var trainData = [];
      var maxLength = 0;
      var remainingLength = 0;

      firebase.database().ref('users/' + uid + '/trainData').on('value', function(snapshot) {
        trainData = [];
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          trainData.push(childData);
        });

        if (trainData.length == 0) {
          trainData.push({
            input: [1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0],
            output: {
              [1]: 1
            }
          });
        }

        //Commands to fill up the arrays with zeros. All arrays must be of same length
        for (j = 0; j < trainData.length; j++) {
          if (trainData[j].input.length > maxLength) {
            maxLength = trainData[j].input.length;
          }
        }
        for (q = 0; q < trainData.length; q++) {
          if (trainData[q].input.length < maxLength) {
            remainingLength = maxLength - trainData[q].input.length;
            zeroArray = Array(remainingLength).fill(0);
            trainData[q].input = trainData[q].input.concat(zeroArray);
          }
        }

        firebase.database().ref('users/' + uid + '/jsonData').on('value', function(snapshot) {
          var json = JSON.parse(snapshot.val());
          if (json) {
            net.fromJSON(json);
          } else {
            //Training
            net.train(trainData); //Using all the training data to train the AI
      
            var toJson = net.toJSON();
            var jsonDataRef = firebase.database().ref('users/' + uid + '/jsonData');
            jsonDataRef.set(JSON.stringify(toJson));
          }
        });

        $('.loading').hide();
      });

      var message_side = 'left';
      var hasResponse = false;

      function sendMessage(text) {
        // reset input value
        $('.message_input').val('');

        message_side = message_side === 'left' ? 'right' : 'left';

        var message = $($('.message_template').clone().html());

        message.addClass(message_side).find('.text').html(text);

        $('.messages').append(message);

        message.addClass('appeared');

        $('.messages').animate({
          scrollTop: $('.messages').prop('scrollHeight')
        }, 300);
      };

      var binary_message;

      function verifyMessage() {
        var input = $('.message_input').val();
        if (input != '') {
          binary_message = textToBinary(input);

          sendMessage(input);

          var result = brain.likely(binary_message, net);

          for (k = 1; k <= botTalk.length; k++) {
            if (result == k) {
              delayVar = k;
              setTimeout(function() {
                sendMessage(botTalk[delayVar - 1]);
                hasResponse = true;
                $('.edit_answer').show();
              }, 800);
            }
          }
        }
      };

      $('.send_message').click(function() {
        verifyMessage();
      });

      $('.message_input').keyup(function(e) {
        if (e.which === 13) {
          verifyMessage();
        }
      });


      $('.edit_answer').click(function() {
        if (hasResponse) {
          $('.messages').children().last().children().last().children().last().css('color', '#F44D3C');

          $('.training_area').show();
          $('.message_area').hide();
        } else {
          alert('First, send a message to Nino.');
        }
      })

      $('.cancel').click(function() {
        $('.messages').children().last().children().last().children().last().css('color', '#121212');
        $('.training_area').hide();
        $('.message_area').show();
      })

      function successfulTrained() {
        $('.edit_answer').hide();

        message_side = 'left';

        var message = $($('.message_template').clone().html());

        message.addClass(message_side).find('.text').html('All right! Thanks for making me smarter!');

        $('.messages').append(message);

        message.addClass('appeared');

        $('.messages').animate({
          scrollTop: $('.messages').prop('scrollHeight')
        }, 300);
      }

      function verifyTrain() {
        var input = $('.train_input').val();
        if (input != '') {
          $('.training_area').hide();
          $('.message_area').show();

          var trainDataRef = firebase.database().ref('users/' + uid + '/trainData');
          trainDataRef.push().set({
            input: binary_message,
            output: {
              [botTalk.length + 1]: 1
            }
          });

          var botTalkRef = firebase.database().ref('users/' + uid + '/botTalk');
          botTalkRef.push().set($('.train_input').val());

          net = new brain.NeuralNetwork(brainConfig);

          //Training the AI
          net.train(trainData);

          var toJson = net.toJSON();
          var jsonDataRef = firebase.database().ref('users/' + uid + '/jsonData');
          jsonDataRef.set(JSON.stringify(toJson));

          successfulTrained();

          $('.message_input').val('');
          $('.train_input').val('');
        }
      };

      $('.send_train').click(function() {
        $('.loading').show();
        window.setTimeout(verifyTrain, 100);
      });

      $('.train_input').keyup(function(e) {
        if (e.which === 13) {
          $('.loading').show();
          window.setTimeout(verifyTrain, 100);
        }
      });

      function textToBinary(text) {
        //Storing all letters as binary numbers for AI
        text = text.toUpperCase();
        var data = [];

        for (i = 0; i < text.length; i++) {

          if (text[i] == 'A') {
            data = data.concat([1, 0, 0, 0, 0, 0, 0]);
          } else if (text[i] == 'B') {
            data = data.concat([1, 0, 0, 0, 0, 0, 1]);
          } else if (text[i] == 'C') {
            data = data.concat([1, 0, 0, 0, 0, 1, 0]);
          } else if (text[i] == 'D') {
            data = data.concat([1, 0, 0, 0, 0, 1, 1]);
          } else if (text[i] == 'E') {
            data = data.concat([1, 0, 0, 0, 1, 0, 0]);
          } else if (text[i] == 'F') {
            data = data.concat([1, 0, 0, 0, 1, 0, 1]);
          } else if (text[i] == 'G') {
            data = data.concat([1, 0, 0, 0, 1, 1, 0]);
          } else if (text[i] == 'H') {
            data = data.concat([1, 0, 0, 0, 1, 1, 1]);
          } else if (text[i] == 'I') {
            data = data.concat([1, 0, 0, 1, 0, 0, 0]);
          } else if (text[i] == 'J') {
            data = data.concat([1, 0, 0, 1, 0, 0, 1]);
          } else if (text[i] == 'K') {
            data = data.concat([1, 0, 0, 1, 0, 1, 0]);
          } else if (text[i] == 'L') {
            data = data.concat([1, 0, 0, 1, 0, 1, 1]);
          } else if (text[i] == 'M') {
            data = data.concat([1, 0, 0, 1, 1, 0, 0]);
          } else if (text[i] == 'N') {
            data = data.concat([1, 0, 0, 1, 1, 0, 1]);
          } else if (text[i] == 'O') {
            data = data.concat([1, 0, 0, 1, 1, 1, 0]);
          } else if (text[i] == 'P') {
            data = data.concat([1, 0, 0, 1, 1, 1, 1]);
          } else if (text[i] == 'Q') {
            data = data.concat([1, 0, 1, 0, 0, 0, 0]);
          } else if (text[i] == 'R') {
            data = data.concat([1, 0, 1, 0, 0, 0, 1]);
          } else if (text[i] == 'S') {
            data = data.concat([1, 0, 1, 0, 0, 1, 0]);
          } else if (text[i] == 'T') {
            data = data.concat([1, 0, 1, 0, 0, 1, 1]);
          } else if (text[i] == 'U') {
            data = data.concat([1, 0, 1, 0, 1, 0, 0]);
          } else if (text[i] == 'V') {
            data = data.concat([1, 0, 1, 0, 1, 0, 1]);
          } else if (text[i] == 'W') {
            data = data.concat([1, 0, 1, 0, 1, 1, 0]);
          } else if (text[i] == 'X') {
            data = data.concat([1, 0, 1, 0, 1, 1, 1]);
          } else if (text[i] == 'Y') {
            data = data.concat([1, 0, 1, 1, 0, 0, 0]);
          } else if (text[i] == 'Z') {
            data = data.concat([1, 0, 1, 1, 0, 0, 1]);
          } else if (text[i] == '?') {
            data = data.concat([1, 1, 1, 1, 1, 1, 1]);
          }
        }
        //Used the code below to be able to read long arrays
        //console.log(data.toString());

        //Fill user input array with zeros to get correct length
        if (data.length < maxLength) {
          remainingLength = maxLength - data.length;
          zeroArray = Array(remainingLength).fill(0);
          data = data.concat(zeroArray);
        }
        return data;
      }
    } else {
      // User is signed out
      $('.login').show();
      $('.logged').hide();
      $('.loading').hide();
    }
  });
});
