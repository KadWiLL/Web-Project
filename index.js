var PlayersData = [];
var play1Bounty = 100;
var compBounty = 100;
var chances = 3;
var currentPlayer;

function Register() {
	var username = document.getElementById("username").value;
	var email = document.getElementById("email").value;
	var age = document.getElementById("age").value;
	var dob = new Date(document.getElementById("dob").value);
	var gender = document.getElementById("gender").value;

	//validating username
	if (username === "") {
		window.alert("Enter your username.");
	} else if (username.length < 4) {
		window.alert("Username must be more than three (3) characters in length.");
	} else {
		var usernameResult = true;
	}

	//validating email
	var emailFormat = /^([a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@gmail\.com)$/;
	if (email === "") {
		window.alert("Enter your email address.");
	} else if (!email.match(emailFormat)) {
		window.alert("Email address entered is invalid.");
	} else {
		var emailResult = true;
	}

	//validating age & dob 
	var monthDiff = Date.now() - dob.getTime(); //calculating month difference from the current date in time format  
	var ageDate = new Date(monthDiff); //converting the month difference in date format        
	var year = ageDate.getUTCFullYear(); //extracting year from date  
	var age2 = Math.abs(year - 1970); //calculating age of player

	if (age === "") {
		window.alert("Enter your age.");
	} else if (age2 < 6) {
		window.alert("Must be six (6) years or older to play.");
	} else if (age2 != age) {
		window.alert("Age entered does not correspond with date of birth.");
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
			dob: dob,
			email: email,
			age: age2,
			gender: gender
		}
		currentPlayer.wins = 0
		currentPlayer.losses = 0
		currentPlayer.gamesPlayed = 0
		currentPlayer.guesses = {
			correct: [],
			wrong: []
		}

		play1Bounty = 100
		compBounty = 100

		PlayersData.push(currentPlayer)

		document.getElementById('register').disabled = true; //register button disabled after it was pressed and all entries validated
		document.getElementById('playerDetails').disabled = true; //fields disabled after register button was pressed and all entries validated
		document.getElementById('play').disabled = false; //play button enabled after register button was pressed and all entries validated
	}
} //function ends

function CheckGuess() {
	var guess1 = parseFloat(document.getElementById("guess1").value);
	var gameResult = document.getElementById("game-result")

	var player_total = 0;
	var computer_total = 0;
	var wins = 0,
		losses = 0,
		games = 1;

	if (guess1 == comCorn) {
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
	} else if ((guess1 > play1Bounty) || (guess1 < 0)) {
		window.alert("Ensure your guess is between 1 and " + play1Bounty + " (the amount of kernels you have)");
	} else if (chances != 0) {
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

	if (chances == 0) {
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
}

function PlayGame() { //function start
	const playagain = document.getElementById('playagainBtn');
	comCorn = Math.floor(Math.random() * 99) + 1; //generating number of computer's corn kernels
	chances = 3

	document.getElementById('guessbtn').disabled = false
	playagain.disabled = true
	document.getElementById("game-container").style.display = "block"
	document.getElementById("game-container").scrollIntoView({
		block: "start",
		behaviour: "smooth"
	})

	document.getElementById("game-content").innerHTML = (
		`Hi! We have selected a random number between 1 and ${play1Bounty}. You have 3 chances to guess the correct number. You will be advised if your guess was too high or low. Good luck!<br><br>` +
		`<em>Random number = ${comCorn}</em>` // TEST - SHOULD BE REMOVED
	)

	document.getElementById("game-result").innerHTML = ""

	//allows user to play again by clicking Play Again button
	playagain.addEventListener("click", () => {
		PlayGame(); // Calls PlayGame Function
	});
} //function end

function findPercentageScore() {
	const resultsArea = document.getElementById("showpercentage")
	const totalResponses = currentPlayer.guesses.correct.length + currentPlayer.guesses.wrong.length
	const percentageScore = Math.ceil((currentPlayer.guesses.correct.length / totalResponses) * 100)

	resultsArea.value = (
		`Player: ${currentPlayer.username},\n` +
		`Date: ${new Date()},\n\n` +
		`Games played: ${currentPlayer.gamesPlayed},\n` +
		`Games won: ${currentPlayer.wins},\n` +
		`Games lost: ${currentPlayer.losses},\n` +
		`Percentage score: ${percentageScore}%`
	)
}

function QuitGame() {
	document.getElementById("registration").reset()
	document.getElementById("game-container").style.display = "none"
	document.getElementById("register").disabled = false
	document.getElementById("play").disabled = true
	document.getElementById("playerDetails").disabled = false
	findPercentageScore()
}



