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

  firebase.database().ref('botTalk').on('value', function(snapshot) {
    botTalk = [];
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      botTalk.push(childData);
    });

    if (botTalk.length == 0) {
      var botTalkRef = firebase.database().ref('botTalk');
      botTalkRef.push().set("hello world");
    }
  });

  //***********Machine learning**************
  var net = new brain.NeuralNetwork({
    activation: 'sigmoid',
    iterations: 128,
    learningRate: 0.9
  });
  var trainData = [];
  var maxLength = 0;
  var remainingLength = 0;

  firebase.database().ref('trainData').on('value', function(snapshot) {
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

    firebase.database().ref('jsonData').on('value', function(snapshot) {
      var json = JSON.parse(snapshot.val());
      if (json) {
        net.fromJSON(json);
      } else {
        //Training
        net.train(trainData, {
          log: true,
          logPeriod: 1,
        }); //Using all the training data to train the AI
  
        var toJson = net.toJSON();
        var jsonDataRef = firebase.database().ref('jsonData');
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

  var badwords = [];

  $.get("https://run.mocky.io/v3/db8ebf66-83a5-47c9-bc5f-6246f7853002", function(data) {
    data.badwords.forEach(function(badword) {
      badwords.push(badword.toUpperCase());
    });
  });

  function hasBadWord(text) {
    var isTrue = false;
    var text_words = text.split(' ');

    text_words.forEach(function(word) {
      badwords.forEach(function(badword) {
        if (word.toUpperCase() === badword) {
          isTrue = true;
        }
      });
    });
    return isTrue;
  }

  function verifyMessage() {
    var input = $('.message_input').val();
    if (input != '') {
      if (hasBadWord(input)) {
        alert("Sem palavrões, por favor.");
        $('.message_input').val('');
      } else {
        binary_message = textToBinary(input);

        sendMessage(input);

        var result = brain.likely(binary_message, net);

        for (k = 1; k <= botTalk.length; k++) {
          if (result == k) {
            delayVar = k;
            setTimeout(function() {
              sendMessage(botTalk[delayVar - 1]);
              hasResponse = true;
            }, 800);
          }
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
      $('.messages').children().last().children().last().children().last().css('color', '#ff6677');

      $('.training_area').removeClass('d-none');
      $('.message_area').addClass('d-none');
    } else {
      alert("Primeiro, envie uma mensagem para a Nino.");
    }
  })

  $('.cancel').click(function() {
    $('.messages').children().last().children().last().children().last().css('color', '#121212');
    $('.training_area').addClass('d-none');
    $('.message_area').removeClass('d-none');
  })

  function verifyTrain() {
    var input = $('.train_input').val();
    if (input != '') {
      if (hasBadWord(input)) {
        alert("Sem palavrões, por favor.");
        $('.train_input').val('');
      } else {
        $('.training_area').addClass('d-none');
        $('.message_area').removeClass('d-none');

        var trainDataRef = firebase.database().ref('trainData');
        trainDataRef.push().set({
          input: binary_message,
          output: {
            [botTalk.length + 1]: 1
          }
        });

        var botTalkRef = firebase.database().ref('botTalk');
        botTalkRef.push().set($('.train_input').val());

        net = new brain.NeuralNetwork({
          activation: 'sigmoid',
          iterations: 128,
          learningRate: 0.9
        });

        //Training the AI
        net.train(trainData, {
          log: true,
          logPeriod: 1,
        });

        var toJson = net.toJSON();
        var jsonDataRef = firebase.database().ref('jsonData');
        jsonDataRef.set(JSON.stringify(toJson));

        alert("Tudo certo! Obrigada por me tornar mais inteligente!");

        $('.message_input').val('');
        $('.train_input').val('');
      }
    }
  };

  $('.send_train').click(function() {
    verifyTrain();
  });

  $('.train_input').keyup(function(e) {
    if (e.which === 13) {
      verifyTrain();
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
