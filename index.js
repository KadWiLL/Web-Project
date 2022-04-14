var PlayersData = [];
var play1Bounty = 100;
var compBounty = 100;
var chances = 3;
var currentPlayer;
var comCorn = 0;

//thread interval
window.setInterval(showFreq, 5000);

function Register() {
	var username = document.getElementById("username").value;
	var email = document.getElementById("email").value;
	var age = document.getElementById("age").value;
	var dob = new Date(document.getElementById("dob").value);
	var dobSave = document.getElementById("dob").value;
	var gender = document.getElementById("gender").value;

	//validating username
	if (username === "") {
		Swal.fire('Enter your username.');
	} else if (username.length < 4) {
		Swal.fire('Username must be more than three (3) characters in length.')
	} else {
		var usernameResult = true;
	}

	//validating email
	var emailFormat = /^([a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@gmail\.com)$/;
	if (email === "") {
		Swal.fire("Enter your email address.");
	} else if (!email.match(emailFormat)) {
		Swal.fire("Email address entered is invalid.");
	} else {
		var emailResult = true;
	}

	//validating age & dob 
	var monthDiff = Date.now() - dob.getTime(); //calculating month difference from the current date in time format  
	var ageDate = new Date(monthDiff); //converting the month difference in date format        
	var year = ageDate.getUTCFullYear(); //extracting year from date  
	var age2 = Math.abs(year - 1970); //calculating age of player

	if (age === "") {
		Swal.fire("Enter your age.");
	} else if (age2 < 6) {
		Swal.fire("Must be six (6) years or older to play.");
	} else if (age2 != age) {	
		Swal.fire("Age entered does not correspond with date of birth.");
		document.getElementById('age').value = age2;
		var ageResult = true;
		var dobResult = true;
	} else {
		var dobResult = true;
		var ageResult = true;
	}

	if ((usernameResult === true) && (emailResult === true) && (ageResult === true) && (dobResult === true)) {
		//appending the validated content to global array
		//PlayersData.push(username + dob + email + age2 + gender);
		currentPlayer = {
			username: username,
			dob: dobSave,
			email: email,
			age: age2,
			gender: gender,
			wins: 0,
			losses: 0,
			gamesPlayed: 0,
			guesses: {
				correct: [],
				wrong: []
			}
		}

		play1Bounty = 100
		compBounty = 100

		PlayersData.push(currentPlayer)
		console.log(PlayersData);

		document.getElementById('register').disabled = true; //register button disabled after it was pressed and all entries validated
		document.getElementById('playerDetails').disabled = true; //fields disabled after register button was pressed and all entries validated
		document.getElementById('play').disabled = false; //play button enabled after register button was pressed and all entries validated
	}
	
	showCurrentPlayer();
} //function ends

function CheckGuess() {
	var guess1 = parseFloat(document.getElementById("guess1").value);
	var gameResult = document.getElementById("game-result")
	var winningGameAudio = new Audio('sounds/winning.wav')
	var losingGameAudio = new Audio('sounds/losing.wav')
	

	var player_total = 0;
	var computer_total = 0;
	var wins = 0,
		losses = 0,
		games = 1;

	if (guess1 === comCorn) {
		winningGameAudio.play();
		games++; //games counter
		wins++; //Games Won Counter
		play1Bounty += guess1
		compBounty -= guess1

		document.getElementById('playagainBtn').disabled = false; //enables play again button
		document.getElementById('guessbtn').disabled = true; //disables guess button
		gameResult.innerHTML = `<br>You Won The Game!!!<br>Player Total: ${play1Bounty}<br>Computer Total: ${compBounty}`

		currentPlayer.wins++
		currentPlayer.gamesPlayed++
		currentPlayer.guesses.correct.push(guess1)
	} else {
		losingGameAudio.play();
	} 

	if (guess1 < 1 || guess1 > 100){
		Swal.fire("Ensure your guess is between 1 and 100 (the amount of kernels you have)");
	}
	
	if (chances != 0 && guess1 !== comCorn) {
		chances--;
		currentPlayer.guesses.wrong.push(guess1)
		play1Bounty -= guess1
		compBounty += guess1

		if (guess1 > comCorn) {
			gameResult.innerHTML = `<br><br>Your guess is too high!<br>Chances remaining: ${chances}`
		} else { // guess is less than the computer's corn
			gameResult.innerHTML = `<br><br>Your guess is too low!<br>Chances remaining: ${chances}`			
		}
	}


	if (chances == 0 && guess1 !== comCorn) {
		guess1 = parseFloat(guess1);
		games++; //games counter
		losses++; //Games Lost Counter

		currentPlayer.losses++
		currentPlayer.gamesPlayed++

		play1Bounty -= guess1
		compBounty += guess1

		gameResult.innerHTML = `<br>You Lost The Game!!!<br>Player Total: ${play1Bounty}<br>Computer Total: ${compBounty}`
		document.getElementById('playagainBtn').disabled = false; //enables play again button
		document.getElementById('guessbtn').disabled = true; //disables guess button
	}

	document.getElementById('guess1').value = ''; //clearing guess field
	showAll();
}


function PlayGame() { //function start
	const playagain = document.getElementById('playagainBtn');
	comCorn = Math.floor(Math.random() * 99) + 1; //generating number of computer's corn kernels
	chances = 3;
	var startGameAudio = new Audio('sounds/start.wav');
	startGameAudio.play();

	document.getElementById('guessbtn').disabled = false
	playagain.disabled = true
	document.getElementById("game-container").style.display = "block"
	document.getElementById("game-container").scrollIntoView({
		block: "start",
		behaviour: "smooth"
	})

	document.getElementById("game-content").innerHTML = (
		`Hi! We have selected a random number between 1 and 100. You have 3 chances to guess the correct number. You will be advised if your guess was too high or low. Good luck!<br><br>` +
		`<em>Random number = ${comCorn}</em>` // TEST - SHOULD BE REMOVED
	)

	document.getElementById("game-result").innerHTML = ""

	//allows user to play again by clicking Play Again button
	playagain.addEventListener("click", () => {
		PlayGame(); // Calls PlayGame Function
	});
} //function end

function showCurrentPlayer(){
	const resultsArea = document.getElementById("showpercentage")
	const totalResponses = currentPlayer.guesses.correct.length + currentPlayer.guesses.wrong.length
	const percentageScore = Math.ceil((currentPlayer.guesses.correct.length / totalResponses) * 100)

	resultsArea.value = (
		`Player: ${currentPlayer.username},\n` +
		`Date: ${new Date()},\n\n` +
		`Games played: ${currentPlayer.gamesPlayed},\n` +
		`Games won: ${currentPlayer.wins},\n` +
		`Games lost: ${currentPlayer.losses},\n` +
		`Percentage score: ${ (percentageScore === null) ? "0" : percentageScore}%`
	)
}

function findPercentageScore() {
	showCurrentPlayer();
}

function QuitGame() {
	document.getElementById("registration").reset()
	document.getElementById("game-container").style.display = "none"
	document.getElementById("register").disabled = false
	document.getElementById("play").disabled = true
	document.getElementById("playerDetails").disabled = false
	findPercentageScore()
	currentPlayer.gamesPlayed = 100;
}

function showAll() {
	const resultsArea = document.getElementById("showpercentage")
	const totalResponses = currentPlayer.guesses.correct.length + currentPlayer.guesses.wrong.length
	var showAllPlayer = document.getElementById('showallplayers');
	const username = '';
	const age = 0;


	PlayersData.forEach(player => {
		const percentageScore = Math.ceil((player.guesses.correct.length / totalResponses) * 100)
		
		var data = '';

		//show all players from playerData
		PlayersData.forEach(p => {
			var db = "" + p.dob;

			data += `Player: ${p.username},\n` +
					`DOB: ${db.substring(0,22)},\n\n` +
					`Games played: ${p.gamesPlayed},\n` +
					`Games won: ${p.wins},\n` +
					`Games lost: ${p.losses},\n` +
					`Percentage score: ${percentageScore}% \n\n`;
		});
		

		showAllPlayer.value = data;
			
				
	});
}

function showFreq(){
	document.getElementById("bar").hidden = false
	document.getElementById("table").hidden = false
	var maleFBar = document.getElementById("bar-n");
	var femaleFBar = document.getElementById("bar-f");
	var l20 = document.getElementById("bar-l20");
	var l20_39 = document.getElementById("bar-20-39");
	var l40_69 = document.getElementById("bar-40-69");
	var g70 = document.getElementById("bar-g70");	

	// gender frequency
	var female = 0;
	var male = 0;

	//age frequency
	var less20 = 0;
	var b20T39 = 0;
	var b40T69 = 0;
	var gre69 = 0;

	//extracting data from each player
	PlayersData.forEach(player => {
		if (player.gender === "female"){
			female = female + 1;
		} else {
			if (player.gender === "male"){
				male = male + 1;
			}		
		}

		if (player.age < 20){
			less20 = less20 + 1;
		} else {
			if (player.age >= 20 && player.age < 40){
				b20T39 = b20T39 + 1;
			} else {
				if (player.age >= 40 && player.age <= 69){
					b40T69 = b40T69 + 1;
				} else {
					if (player.age > 69){
						gre69 = gre69 + 1;
					}
				}
			}
		}
	});

	//get the frequency of each value
	var freqFemale = (female / PlayersData.length) * 100; 
	var freqMale = (male / PlayersData.length) * 100; 
	var freqL20 = (less20 / PlayersData.length) * 100;
	var freq20_39 = (b20T39 / PlayersData.length) * 100;
	var freq40_69 = (b40T69 / PlayersData.length) * 100;
	var freqG70 = (gre69 / PlayersData.length) * 100;


	//add percentage to bar
	femaleFBar.style.width = (female === 0) ? "0px" : `${freqFemale}%`;
	maleFBar.style.width = (male === 0) ? "0px" : `${freqMale}%`;
	l20.style.width = (less20 === 0) ? "0px" : `${freqL20}%`;
	l20_39.style.width = (b20T39 === 0) ? "0px" : `${freq20_39}%`;
	l40_69.style.width = (b40T69 === 0) ? "0px" : `${freq40_69}%`;
	g70.style.width = (gre69 === 0) ? "0px" : `${freqG70}%`;
}

