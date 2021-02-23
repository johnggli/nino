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
	var yes = document.getElementById("yesButton");
	var txt = document.getElementById("textBox");
	var confirm = document.getElementById("confirmation");
	var help = document.getElementById("helpBox");
	var helpBtn = document.getElementById("helpButton");
	var trainingArea = document.getElementById("trainArea");



	// var botTalk = [];
	// firebase.database().ref("botTalk").once('value', function(snapshot) {
	// 	snapshot.forEach(function(childSnapshot) {
	// 		var childData = childSnapshot.val();
	// 		botTalk.push(Object.values(childData));
	// 	});
	// });
	
	// var botTalk = ["Hello! I hope you have a good day!", "I am fine, thanks!", "I have no name, but my creators name is Nino"];


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
	var commands = 7;

	// ref = firebase.database().ref('botTalk');
	// ref.push().set("ola turubom");
	// ref = firebase.database().ref('trainData');
	// ref.push().set({ input: [1,0,0,0,1,1,1,1,0,0,0,1,0,0,1,0,1,1,0,0,0], output: {[1]: 1} });

	// var postListRef = firebase.database().ref('botTalk');
	// postListRef.push().set({
	// 	chama: "Hello! I hope you have a good day!"
	// });

	// var postListRef = firebase.database().ref('trainData');
	// postListRef.push().set({
	// 	input: [1,0,0,0,1,1,1,1,0,0,1,0,0,0], output: {[1]: 1}
	// });
	// postListRef.push().set({
	// 	input: [1,0,0,0,1,1,1,1,0,0,0,1,0,0,1,0,1,1,0,0,0], output: {[1]: 1}
	// });

	// firebase.database().ref("trainData").once('value', function(snapshot) {
	// 	var trainData3 = [];
	// 	snapshot.forEach(function(childSnapshot) {
	// 		var childData = childSnapshot.val();
	// 		childData.output = childData.output.reduce((accumulator, currentValue) => {
	// 			accumulator[currentValue] = currentValue;
	// 			return accumulator;
	// 		}, {});
	// 		trainData3.push({ input: [1,0,0,0,1,1,1,1,0,0,1,0,0,0], output: {[1]: 1} });
	// 	});
	// 	trainData = trainData3
	// 	console.log('trainData3', trainData3)
	// });


	// var ref = firebase.database().ref("trainData")

	// trainData = ref.once('value', function(snapshot) {
	// 	return snapshot.val()
	// })

	// function getData1() {
	// 	var data = []

	// 	ref.once('value', function(snapshot) {
	// 		snapshot.forEach(function(childSnapshot) {
	// 			var childData = childSnapshot.val();
	// 			childData.output = childData.output.reduce((accumulator, currentValue) => {
	// 				accumulator[currentValue] = currentValue;
	// 				return accumulator;
	// 			}, {});
	// 			data.push({ input: [1,0,0,0,1,1,1,1,0,0,1,0,0,0], output: {[1]: 1} });
	// 		});
	// 	})

	// 	return data
	// }

	// async function getData() {
	// 	var result = await getData1()
	// 	return result
	// }

	// async function gotData(data) {
	// 	var trains = data.val()
	// 	var keys = Object.keys(trains)

	// 	for (var i = 0; i < keys.length; i++) {
	// 		console.log('entrous', i)
	// 	}
	// }

	// function errData(err) {
	// 	console.log(err)
	// }

	//Greeting
	// trainData.push({ input: [1,0,0,0,1,1,1,1,0,0,1,0,0,0], output: {[1]: 1} }); //HI
	// trainData.push({ input: [1,0,0,0,1,1,1,1,0,0,0,1,0,0,1,0,1,1,0,0,0], output: {[1]: 1} }); //HEY
	// trainData.push({ input: [1,0,0,0,1,1,1,1,0,0,0,1,0,0,1,0,0,1,0,1,1,1,0,0,1,0,1,1,1,0,0,1,1,1,0], output: {[1]: 1} }); //HELLO
	// trainData.push({ input: [1,0,1,1,0,0,0,1,0,0,1,1,1,0], output: {[1]: 1} }); //Yo 
																														
	// //How are you?
	// trainData.push({ input: [1,0,0,0,1,1,1,1,0,0,1,1,1,0,1,0,1,0,1,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,1,0,0,0,1,0,0,1,0,1,1,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,0,0,1,1,1,1,1,1,1], output: {[2]: 1} }); //How are you?

	// trainData.push({ input: [1,0,0,0,0,0,0,1,0,1,0,0,0,1,1,0,0,0,1,0,0,1,0,1,1,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,0,0,1,0,0,1,1,1,0,1,0,0,1,0,1,0,1,1,1,1,1,1,1], output: {[2]: 1} }); //Are you ok?

	// //What is your name?
	// trainData.push({ input: [1,0,1,0,1,1,0,1,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,1,0,0,1,1,1,0,0,1,0,0,0,1,0,1,0,0,1,0,1,0,1,1,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,1,0,0,1,1,0,1,1,0,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,0,1,1,1,1,1,1,1], output: {[3]: 1} }); //What is your name?
	// trainData.push({ input: [1,0,1,0,1,1,0,1,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,1,0,0,1,1,1,0,1,0,0,1,0,1,0,1,1,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,1,0,0,1,1,0,1,1,0,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,0,1,1,1,1,1,1,1], output: {[3]: 1} }); //Whats your name?
	// trainData.push({ input: [1,0,1,0,1,1,0,1,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,1,0,0,1,1,1,0,1,0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,1,0,0,1,1,0,1,1,0,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,0,1,1,1,1,1,1,1], output: {[3]: 1} }); //Whats ur name?
	// trainData.push({ input: [1,0,1,1,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,1,0,0,1,1,0,1,1,0,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,0,1,1,1,1,1,1,1], output: {[3]: 1} }); //Your name?
	// trainData.push({ input: [1,0,1,0,1,1,0,1,0,0,0,1,1,1,1,0,0,1,1,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1,1,0,0,0,1,0,0,1,0,1,1,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,0,0,1,1,1,1,1,1,1], output: {[3]: 1} }); //Who are you?
	// trainData.push({ input: [1,0,0,1,1,0,1,1,0,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,0,1,1,1,1,1,1,1], output: {[3]: 1} }); //Name?
																																																										
	// //Meaning of life?
	// trainData.push({ input: [1,0,1,0,1,1,0,1,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,1,0,0,1,1,1,0,0,1,0,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,1,0,1,1,0,0,1,0,0,0,1,0,0,1,1,0,1,1,0,0,0,1,1,0,1,0,0,1,1,1,0,1,0,0,0,1,0,1,1,0,0,1,0,1,1,1,0,0,1,0,0,0,1,0,0,0,1,0,1,1,0,0,0,1,0,0,1,1,1,1,1,1,1], output: {[4]: 1} }); //What is the meaning of life?
	// trainData.push({ input: [1,0,0,1,1,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,1,1,0,1,1,0,0,1,0,0,0,1,0,0,1,1,0,1,1,0,0,0,1,1,0,1,0,0,1,1,1,0,1,0,0,0,1,0,1,1,0,0,1,0,1,1,1,0,0,1,0,0,0,1,0,0,0,1,0,1,1,0,0,0,1,0,0,1,1,1,1,1,1,1], output: {[4]: 1} }); //Meaning of life?

	// //How old are you?
	// trainData.push({ input: [1,0,0,0,1,1,1,1,0,0,1,1,1,0,1,0,1,0,1,1,0,1,0,0,1,1,1,0,1,0,0,1,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,1,0,1,0,0,0,1,1,0,0,0,1,0,0,1,0,1,1,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,0,0,1,1,1,1,1,1,1], output: {[5]: 1} }); //How old are you?
	// trainData.push({ input: [1,0,1,0,1,1,0,1,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,1,0,0,1,1,1,0,0,1,0,0,0,1,0,1,0,0,1,0,1,0,1,1,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,0,1,1,1,1,1,1,1], output: {[5]: 1} }); //What is your age?
	// trainData.push({ input: [1,0,1,0,1,1,0,1,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,1,0,0,1,1,1,0,1,0,0,1,0,1,0,1,1,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,0,1,1,1,1,1,1,1], output: {[5]: 1} }); //Whats your age?
	// trainData.push({ input: [1,0,1,0,1,1,0,1,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,1,0,0,1,1,1,0,1,0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,0,1,1,1,1,1,1,1], output: {[5]: 1} }); //Whats ur age?
																																																										
	// //Are you human?
	// trainData.push({ input: [1,0,0,0,0,0,0,1,0,1,0,0,0,1,1,0,0,0,1,0,0,1,0,1,1,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,0,0,1,0,0,0,1,1,1,1,0,1,0,1,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0,1,0,0,1,1,0,1,1,1,1,1,1,1,1], output: {[6]: 1} }); //Are you human?
	// trainData.push({ input: [1,0,0,0,1,1,1,1,0,1,0,1,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0,1,0,0,1,1,0,1,1,1,1,1,1,1,1], output: {[6]: 1} }); //human?

	firebase.database().ref("trainData").on('value', function(snapshot) {
		trainData = [];
		snapshot.forEach(function(childSnapshot) {
			var childData = childSnapshot.val();
			// childData.output = childData.output.reduce((accumulator, currentValue) => {
			// 	accumulator[currentValue] = currentValue;
			// 	return accumulator;
			// }, {});
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
	//Chat button
	chat.addEventListener("click",function(){
		if (txt.value != ""){
			newDiv("green",txt.value);
			var data = textToBinary(txt.value);
				var result = brain.likely(data, net);
				for (k=1;k<=botTalk.length;k++){
					if (result == k){
						delayVar=k;
						setTimeout(function(){
							newDiv("orange",botTalk[delayVar-1]);
							trainingArea.style.display="inline";
						},800);
					}
				}
			help.style.display = "none";
			helpBtn.style.display = "none";
		}
	});

	yes.addEventListener("click", function(){
		alert("Sweet!");
		txt.value="";
		help.style.display = "none";
		helpBtn.style.display = "none";
		trainingArea.style.display="none";
	})

	no.addEventListener("click", function(){
		alert("Oh, I am sorry! What would be a good response to your input?");
		divArr[divArr.length-1].style.backgroundColor="#ff6666"
		help.style.display = "inline";
		helpBtn.style.display = "inline";
	})

	helpBtn.addEventListener("click", function(){
		trainingArea.style.display="none";
		// botTalk.push(help.value);

		newInput = textToBinary(txt.value);
		// trainData.push({ input: newInput, output: {[commands]: 1} }); //user training data

		ref = firebase.database().ref('trainData');
		ref.push().set({ input: newInput, output: {[botTalk.length + 1]: 1} });
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
