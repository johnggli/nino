window.addEventListener('load', function() {
	var firebaseConfig = {
		apiKey: "AIzaSyD5WPrxLPtaJfCju56pxhu6r8sGYDn7tc8",
		authDomain: "nino-ff8f0.firebaseapp.com",
		databaseURL: "https://nino-ff8f0-default-rtdb.firebaseio.com",
		projectId: "nino-ff8f0",
		storageBucket: "nino-ff8f0.appspot.com",
		messagingSenderId: "190961029360",
		appId: "1:190961029360:web:3a3dec27adeba2685fb235"
	};

	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);

	var chat = document.getElementById("chatButton");
	var no = document.getElementById("noButton");
	var txt = document.getElementById("textBox");
	var help = document.getElementById("helpBox");
	var helpBtn = document.getElementById("helpButton");
	var trainingArea = document.getElementById("trainArea");

	// var Message;
	// Message = function (arg) {
	// 	(this.text = arg.text), (this.message_side = arg.message_side);
	// 	this.draw = (function (_this) {
	// 		return function () {
	// 			var $message;
	// 			$message = $($(".message_template").clone().html());
	// 			$message.addClass(_this.message_side).find(".text").html(_this.text);
	// 			$(".messages").append($message);
	// 			return setTimeout(function () {
	// 				return $message.addClass("appeared");
	// 			}, 0);
	// 		};
	// 	})(this);
	// 	return this;
	// };



	var botTalk = [];
	firebase.database().ref("botTalk").on('value', function(snapshot) {
		botTalk = [];
		snapshot.forEach(function(childSnapshot) {
			var childData = childSnapshot.val();
			botTalk.push(childData);
		});

		console.log(botTalk)
	});



	var divArr=[];
	var delayVar=0;

	function newDiv(COLOR, TEXT) {
		var newdiv = document.createElement("div");

		newdiv.style.width = "90%";
		newdiv.style.height = "10%";
		newdiv.style.background = COLOR;
		if(COLOR=="green"){
			newdiv.style.left="53%";
		}
		else{
			newdiv.style.left="47%";
		}
		newdiv.style.bottom="15%";
		newdiv.style.position="fixed";
		newdiv.style.borderRadius="10px";
		newdiv.style.transform="translate(-50%,0)";
		newdiv.style.paddingLeft ="10px";
		newdiv.style.paddingTop ="5px";
		newdiv.style.fontFamily="	Verdana, Times, serif";
		newdiv.innerHTML = TEXT;
		newdiv.style.border = "1px solid black";
		newdiv.style.color="white";
		document.body.appendChild(newdiv);

		divArr.push(newdiv);

		for (y=0;y<divArr.length-1;y++) {
			if (divArr[y].style.bottom=="15%"){
				divArr[y].style.bottom="28%";
			}
			else if (divArr[y].style.bottom=="28%"){
				divArr[y].style.bottom="41%";
			}
			else if (divArr[y].style.bottom=="41%"){
				divArr[y].style.bottom="54%";
			}
			else if (divArr[y].style.bottom=="54%"){
				divArr[y].style.bottom="67%";
			}
			else if (divArr[y].style.bottom=="67%"){
				divArr[y].style.bottom="80%";
			}
			else if (divArr[y].style.bottom=="80%"){
				divArr[y].style.bottom="93%";
			}
			else if (divArr[y].style.bottom=="93%"){
				divArr[y].style.bottom="106%";
			}
			else if(divArr[y].style.bottom=="106%"){
				divArr[y].style.display="none";
			}
		}
	}

	//***********Machine learning**************
	var net = new brain.NeuralNetwork();
	var trainData = [];
	var maxLength = 0;
	var remainingLength = 0;
	var newInput;

	firebase.database().ref("trainData").on('value', function(snapshot) {
		trainData = [];
		snapshot.forEach(function(childSnapshot) {
			var childData = childSnapshot.val();
			console.log('childata antes do push', childData)
			trainData.push(childData);
		});

		console.log(trainData)
		console.log('length do bottalk dentro do traindata', botTalk.length)
	
		//Commands to fill up the arrays with zeros. All arrays must be of same length
		for (j=0;j<trainData.length;j++){
			if (trainData[j].input.length > maxLength){
				maxLength = trainData[j].input.length;
			}
		}
		for (q=0;q<trainData.length;q++){
			if (trainData[q].input.length < maxLength){
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


	var message_side = "left";

	function sendMessage(text) {
		txt.value = "";

		var messages = document.querySelector(".messages");

		message_side = message_side === "left" ? "right" : "left";

		var message = $($(".message_template").clone().html());
		console.log(messages)
		message.addClass(message_side).find(".text").html(text);
		$(".messages").append(message);
		message.addClass("appeared");
		messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
	};

	var inputData;


	$(".send_message").click(function (e) {
		if (txt.value != ""){
			inputData = textToBinary(txt.value);
			sendMessage(txt.value);
			var result = brain.likely(inputData, net);
			for (k=1;k<=botTalk.length;k++){
				if (result == k){
					delayVar=k;
					setTimeout(function(){
						sendMessage(botTalk[delayVar-1]);
					},800);
				}
			}
		}
	});
	$(".message_input").keyup(function (e) {
		if (e.which === 13) {
			if (txt.value != ""){
				inputData = textToBinary(txt.value);
				sendMessage(txt.value);
				var result = brain.likely(inputData, net);
				for (k=1;k<=botTalk.length;k++){
					if (result == k){
						delayVar=k;
						setTimeout(function(){
							sendMessage(botTalk[delayVar-1]);
						},800);
					}
				}
			}
		}
	});

	no.addEventListener("click", function(){
		alert("Oh, I am sorry! What would be a good response to your input?");
		$('.messages').children().last().css('background-color', '#ff6677')
		trainingArea.style.display="inline";
		help.style.display = "inline";
		helpBtn.style.display = "inline";
	})

	helpBtn.addEventListener("click", function(){
		trainingArea.style.display="none";
		// botTalk.push(help.value);

		// newInput = textToBinary(txt.value);
		// trainData.push({ input: newInput, output: {[commands]: 1} }); //user training data

		ref = firebase.database().ref('trainData');
		ref.push().set({ input: inputData, output: {[botTalk.length + 1]: 1} });
		// trainData = []

		ref = firebase.database().ref('botTalk');
		ref.push().set(help.value);
		// botTalk = []

		// commands = commands+1;

		net = new brain.NeuralNetwork();

		//Training the AI
		net.train(trainData, {
			log: false,
			logPeriod: 10,
			errorThresh: 0.0005,
		});

		alert("Alright! Thanks for making me smarter!");

		txt.value="";
		help.value="";
		help.style.display = "none";
		helpBtn.style.display = "none";

		console.log('a galera toda depois do alert de thanks:')
		console.log('bottalk', botTalk)
		console.log('trainData', trainData)

		// location.reload();
	});


	function textToBinary(text){
		//Storing all letters as binary numbers for AI
		text = text.toUpperCase();
		var data = [];
		
		for (i=0;i<text.length;i++){
			
			if ( text[i]=="A"){
				data = data.concat([1,0,0,0,0,0,0]);
			}
			else if (text[i]=="B"){
				data = data.concat([1,0,0,0,0,0,1]);
			}
			else if (text[i]=="C"){
				data = data.concat([1,0,0,0,0,1,0]);
			}
			else if (text[i]=="D"){
				data = data.concat([1,0,0,0,0,1,1]);
			}
			else if (text[i]=="E"){
				data = data.concat([1,0,0,0,1,0,0]);
			}
			else if (text[i]=="F"){
				data = data.concat([1,0,0,0,1,0,1]);
			}
			else if (text[i]=="G"){
				data = data.concat([1,0,0,0,1,1,0]);
			}
			else if (text[i]=="H"){
				data = data.concat([1,0,0,0,1,1,1]);
			}
			else if (text[i]=="I"){
				data = data.concat([1,0,0,1,0,0,0]);
			}
			else if (text[i]=="J"){
				data = data.concat([1,0,0,1,0,0,1]);
			}
			else if (text[i]=="K"){
				data = data.concat([1,0,0,1,0,1,0]);
			}
			else if (text[i]=="L"){
				data = data.concat([1,0,0,1,0,1,1]);
			}
			else if (text[i]=="M"){
				data = data.concat([1,0,0,1,1,0,0]);
			}
			else if (text[i]=="N"){
				data = data.concat([1,0,0,1,1,0,1]);
			}
			else if (text[i]=="O"){
				data = data.concat([1,0,0,1,1,1,0]);
			}
			else if (text[i]=="P"){
				data = data.concat([1,0,0,1,1,1,1]);
			}
			else if (text[i]=="Q"){
				data = data.concat([1,0,1,0,0,0,0]);
			}
			else if (text[i]=="R"){
				data = data.concat([1,0,1,0,0,0,1]);
			}
			else if (text[i]=="S"){
				data = data.concat([1,0,1,0,0,1,0]);
			}
			else if (text[i]=="T"){
				data = data.concat([1,0,1,0,0,1,1]);
			}
			else if (text[i]=="U"){
				data = data.concat([1,0,1,0,1,0,0]);
			}
			else if (text[i]=="V"){
				data = data.concat([1,0,1,0,1,0,1]);
			}
			else if (text[i]=="W"){
				data = data.concat([1,0,1,0,1,1,0]);
			}
			else if (text[i]=="X"){
				data = data.concat([1,0,1,0,1,1,1]);
			}
			else if (text[i]=="Y"){
				data = data.concat([1,0,1,1,0,0,0]);
			}
			else if (text[i]=="Z"){
				data = data.concat([1,0,1,1,0,0,1]);
			}
			else if (text[i]=="?"){
				data = data.concat([1,1,1,1,1,1,1]);
			}
		}
		//Used the code below to be able to read long arrays
		//console.log(data.toString());

		//Fill user input array with zeros to get correct length
		if (data.length < maxLength){
			remainingLength = maxLength - data.length;
			zeroArray = Array(remainingLength).fill(0);
			data = data.concat(zeroArray);
		}
		return data;
	}

});
