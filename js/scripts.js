$(document).ready(function() {
  var firebaseConfig = {
    apiKey: config.API_KEY,
    authDomain: config.AUTH_DOMAIN,
    databaseURL: config.DATABASE_URL,
    projectId: config.PROJECT_ID,
    storageBucket: config.STORAGE_BUCKET,
    messagingSenderId: config.MESSAGING_SENDER_ID,
    appId: config.APP_ID
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var botTalk = [];

  firebase.database().ref('botTalk').on('value', function(snapshot) {
    botTalk = [];
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      botTalk.push(childData);
    });
    $('.loading').hide();
  });

  //***********Machine learning**************
  var net = new brain.NeuralNetwork();
  var trainData = [];
  var maxLength = 0;
  var remainingLength = 0;

  firebase.database().ref('trainData').on('value', function(snapshot) {
    trainData = [];
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      trainData.push(childData);
    });

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

    //Training
    net.train(trainData, {
      log: false,
      logPeriod: 10,
      errorThresh: 0.0005,
    }); //Using all the training data to train the AI
  });

  var message_side = 'left';

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

  $('.send_message').click(function() {
    if ($('.message_input').val() != '') {
      binary_message = textToBinary($('.message_input').val());

      sendMessage($('.message_input').val());

      var result = brain.likely(binary_message, net);

      for (k = 1; k <= botTalk.length; k++) {
        if (result == k) {
          delayVar = k;
          setTimeout(function() {
            sendMessage(botTalk[delayVar - 1]);
          }, 800);
        }
      }
    }
  });

  $('.message_input').keyup(function(e) {
    if (e.which === 13) {
      if ($('.message_input').val() != '') {
        binary_message = textToBinary($('.message_input').val());

        sendMessage($('.message_input').val());

        var result = brain.likely(binary_message, net);

        for (k = 1; k <= botTalk.length; k++) {
          if (result == k) {
            delayVar = k;
            setTimeout(function() {
              sendMessage(botTalk[delayVar - 1]);
            }, 800);
          }
        }
      }
    }
  });


  $('.close').click(function() {
    alert("Oh, I am sorry! What would be a good response to your input?");

    $('.messages').children().last().children().last().children().last().css('color', '#ff6677');

    $('.training_area').removeClass('d-none');
  })


  $('.send_train').click(function() {
    $('.training_area').addClass('d-none');

    var trainDataRef = firebase.database().ref('trainData');
    trainDataRef.push().set({
      input: binary_message,
      output: {
        [botTalk.length + 1]: 1
      }
    });

    var botTalkRef = firebase.database().ref('botTalk');
    botTalkRef.push().set($('.train_input').val());

    net = new brain.NeuralNetwork();

    //Training the AI
    net.train(trainData, {
      log: false,
      logPeriod: 10,
      errorThresh: 0.0005,
    });

    alert("Alright! Thanks for making me smarter!");

    $('.message_input').val('');
    $('.train_input').val('');
  });

  $('.train_input').keyup(function(e) {
    if (e.which === 13) {
      $('.training_area').addClass('d-none');

      var trainDataRef = firebase.database().ref('trainData');
      trainDataRef.push().set({
        input: binary_message,
        output: {
          [botTalk.length + 1]: 1
        }
      });

      var botTalkRef = firebase.database().ref('botTalk');
      botTalkRef.push().set($('.train_input').val());

      net = new brain.NeuralNetwork();

      //Training the AI
      net.train(trainData, {
        log: false,
        logPeriod: 10,
        errorThresh: 0.0005,
      });

      alert("Alright! Thanks for making me smarter!");

      $('.message_input').val('');
      $('.train_input').val('');
    }
  });


  function textToBinary(text) {
    //Storing all letters as binary numbers for AI
    text = text.toUpperCase();
    var data = [];

    for (i = 0; i < text.length; i++) {

      if (text[i] == "A") {
        data = data.concat([1, 0, 0, 0, 0, 0, 0]);
      } else if (text[i] == "B") {
        data = data.concat([1, 0, 0, 0, 0, 0, 1]);
      } else if (text[i] == "C") {
        data = data.concat([1, 0, 0, 0, 0, 1, 0]);
      } else if (text[i] == "D") {
        data = data.concat([1, 0, 0, 0, 0, 1, 1]);
      } else if (text[i] == "E") {
        data = data.concat([1, 0, 0, 0, 1, 0, 0]);
      } else if (text[i] == "F") {
        data = data.concat([1, 0, 0, 0, 1, 0, 1]);
      } else if (text[i] == "G") {
        data = data.concat([1, 0, 0, 0, 1, 1, 0]);
      } else if (text[i] == "H") {
        data = data.concat([1, 0, 0, 0, 1, 1, 1]);
      } else if (text[i] == "I") {
        data = data.concat([1, 0, 0, 1, 0, 0, 0]);
      } else if (text[i] == "J") {
        data = data.concat([1, 0, 0, 1, 0, 0, 1]);
      } else if (text[i] == "K") {
        data = data.concat([1, 0, 0, 1, 0, 1, 0]);
      } else if (text[i] == "L") {
        data = data.concat([1, 0, 0, 1, 0, 1, 1]);
      } else if (text[i] == "M") {
        data = data.concat([1, 0, 0, 1, 1, 0, 0]);
      } else if (text[i] == "N") {
        data = data.concat([1, 0, 0, 1, 1, 0, 1]);
      } else if (text[i] == "O") {
        data = data.concat([1, 0, 0, 1, 1, 1, 0]);
      } else if (text[i] == "P") {
        data = data.concat([1, 0, 0, 1, 1, 1, 1]);
      } else if (text[i] == "Q") {
        data = data.concat([1, 0, 1, 0, 0, 0, 0]);
      } else if (text[i] == "R") {
        data = data.concat([1, 0, 1, 0, 0, 0, 1]);
      } else if (text[i] == "S") {
        data = data.concat([1, 0, 1, 0, 0, 1, 0]);
      } else if (text[i] == "T") {
        data = data.concat([1, 0, 1, 0, 0, 1, 1]);
      } else if (text[i] == "U") {
        data = data.concat([1, 0, 1, 0, 1, 0, 0]);
      } else if (text[i] == "V") {
        data = data.concat([1, 0, 1, 0, 1, 0, 1]);
      } else if (text[i] == "W") {
        data = data.concat([1, 0, 1, 0, 1, 1, 0]);
      } else if (text[i] == "X") {
        data = data.concat([1, 0, 1, 0, 1, 1, 1]);
      } else if (text[i] == "Y") {
        data = data.concat([1, 0, 1, 1, 0, 0, 0]);
      } else if (text[i] == "Z") {
        data = data.concat([1, 0, 1, 1, 0, 0, 1]);
      } else if (text[i] == "?") {
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
});
