	var previous;
	function randomizeNumber() {
		//Randimizes a number between 1 and 6
		var random = Math.floor((Math.random() * 14) + 1);
		console.log(random);
		if(random <= 12){
			random /= 3;
			random ++;
		}
		else if( random == 13)
			random = 5;
		else
			random = 6;
		console.log(parseInt(random));
		return parseInt(random);
	}

	function rollDice(side) {
		//Removes old class and adds the new
		var dice = $('#dice');
		var currentClass = dice.attr('class');
		var newClass = 'show-' + side;
		
		dice.removeClass();
		dice.addClass(newClass);
		
		if (currentClass == newClass) {
			dice.addClass('show-same');
		}
	}
	
	function soundEffect() {
		var audio = $("audio")[0];
		audio.pause();
		audio.currentTime = 0;
		audio.play();
	}
	function rollDiceFromNumber(number){
		if (number == 1) { rollDice('front'); }
		else if (number == 2) { rollDice('back'); }
		else if (number == 3) { rollDice('right'); }
		else if (number == 4) { rollDice('left'); }
		else if (number == 5) { rollDice('top'); }
		else if (number == 6) { rollDice('bottom'); }
		$(".dicNum").html(number);
		rolledDice(number);
	}
	function rollDiceNameNumber(name, number){
		if (number == 1) { rollDice('front'); }
		else if (number == 2) { rollDice('back'); }
		else if (number == 3) { rollDice('right'); }
		else if (number == 4) { rollDice('left'); }
		else if (number == 5) { rollDice('top'); }
		else if (number == 6) { rollDice('bottom'); }
		$(".dicNum").html(number);
		rolledDiceNameNumber(name, number);
	}
	$('.dice-container').on('click ', function() {
		if(isCanPlay == false){
			alert("It's not your turn.");
			return;
		}
		var number = randomizeNumber();
		rollDiceFromNumber(number);
		soundEffect();
	});
	