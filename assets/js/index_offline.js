var arrCars = [];
var arrCurStep = [];
var arrCarPosInCard = [];
var nCurrentUserNumber = -1;
var nMaxNumber = 4;
var nAllUserCount = 0;
var nCurPlayingCount = 0;
var userName = "";
var arrPlayerNames = [];
var arrUsers = [];
var gameState = false;
var arrInviteSendUsers = [];
var nBoardImgNo = 0;
var topicName = "";
var arrQuestionNumbers = [];
var isCanPlay = false;
function getSelectedTopicName(){
	var el = document.getElementById("topicList");
	var options = el && el.options;
	for( var i = 0, iLen = options.length; i<iLen; i++){
		opt = options[i];
		if( opt.selected){
			return opt.text;
		}
	}
	return "";
}
function setContentsToCards(strTopic, arrQuestions){
	if( strTopic == "")return;
	$("#topicList > option").filter(function(){
		return $(this).html() === strTopic;
	}).prop('selected', true);
	jQuery.ajax({
		type: 'POST',
		url: 'topicManager.php',
		data: { getContents: strTopic},
		success: function(obj, textstatus){
			var arrRet = obj.split("\n");
			var strHtml = "";
			var arrContents = [];
			for( i = 0; i < arrRet.length; i++){
				if(arrRet[i] == "")
					continue;
				arrContents.push(arrRet[i]);
			}
			if(arrQuestions.length != 0){
				arrQuestionNumbers = arrQuestions;
			} else{
				if ( arrContents.length < 17) {
					for( ii = 1; ii < 18; ii++){
						var ran = Math.floor(Math.random()*arrContents.length);
						arrQuestionNumbers.push(ran);
					}
				} else{
					while( arrQuestionNumbers.length < 17){
						var ran = Math.floor(Math.random()*arrContents.length);
						if( arrQuestionNumbers.indexOf(ran) == -1){
							arrQuestionNumbers.push(ran);
						}
					}
				}
			}
			for( i = 1; i < 18; i++){
				$("#cardContainer"+i).find(".questionTxt").html(arrContents[arrQuestionNumbers[i-1]]);
			}
		}
	});
}
function setBackgroundImg(nImgNo){
	$(".game_container").css('background-image', 'url("assets/img/bg-img/background-0' + nBoardImgNo + '.png")');
}
function addUser(_name){
	nCurPlayingCount++;
	nCurrentUserNumber ++;
	arrPlayerNames.push(_name);
	var car = $("#player" + (nCurPlayingCount));
	car.find(".playerName").html(arrPlayerNames[nCurPlayingCount-1]);
	car.removeClass("HideItem");
	car.addClass("ShowItem");
	nAllUserCount = nCurPlayingCount;
	arrCars.push(car);
	arrCurStep.push(-1);
	gotoStep(_name,1);
	arrCarPosInCard.push(nCurPlayingCount-1);
}
$(".dice_Btn").on("click", function(){	//NEXT button
	if( $("#myAnswer").val() == "" && document.getElementById("myAnswer").disabled == false){
		alert("Please enter the answer.");
		return;
	}
	var _answer = $("#myAnswer").val();
	$("#myAnswer").val("");
	$(".flip-container").removeClass("hover");

	var nBuff = nCurrentUserNumber + 1;
	nBuff %= nAllUserCount;
	var _name = arrPlayerNames[nBuff];
	SetUserTurn(_name);
	isCanPlay = true;
});

function gotoStep(carName, number){
	if(nAllUserCount == 0) return;
	nCurrentUserNumber = arrPlayerNames.indexOf(carName);
	if(arrCurStep[nCurrentUserNumber] >= 18)
		return;
	var prevStep = arrCurStep[nCurrentUserNumber];
	arrCurStep[nCurrentUserNumber] += number;
	if(arrCurStep[nCurrentUserNumber] >= 18){
		arrCurStep[nCurrentUserNumber] = 18;
		var audio = $("audio")[1];
		audio.pause();
		audio.currentTime = 0;
		audio.play();
		$(".ani-gif").removeClass("HideItem");
		$(".ani-gif").addClass("ShowItem");
		setTimeout(function(){
			$(".ani-gif").removeClass("ShowItem");
			$(".ani-gif").addClass("HideItem");
		}, 5000);

	}
	var car = arrCars[nCurrentUserNumber];
	if( arrCurStep[nCurrentUserNumber] != 0 && arrCurStep[nCurrentUserNumber]!= 18){
		var curCardElem = $("#cardContainer"+arrCurStep[nCurrentUserNumber]);
		curCardElem.toggleClass('hover');	
	}
	var carPos = calcCarPosition(nCurrentUserNumber, arrCurStep[nCurrentUserNumber], true);
	var nleft = carPos.left;
	var ntop = carPos.top;
	car.css({top:ntop, left:nleft, position:'absolute'});
	for( i = 0; i < nAllUserCount; i++){
		if( arrCurStep[i] == prevStep){
			car = arrCars[i];
			arrCarPosInCard[i]--;
			carPos = calcCarPosition(i, arrCurStep[i], false);
			car.css({top:carPos.top, left:carPos.left, position:'absolute'});
		}
	}
	return arrCurStep[nCurrentUserNumber];
}
function rolledDice(number){
	$(".flip-container").removeClass("hover");
	nCurrentUserNumber ++;
	nCurrentUserNumber %= nAllUserCount;
	var userName = arrPlayerNames[nCurrentUserNumber];
	rolledDiceNameNumber( userName, number);
	isCanPlay = false;
}
function rolledDiceNameNumber(_name,_number){
	gotoStep( _name, _number);
}
function calcCarPosition( nCurrentUser, nCardNumber, isNew){
	var nleft;
	var ntop;
	var samePosCount = -1;
	for ( i = 0; i < nAllUserCount; i++){
		if(arrCurStep[i] == nCardNumber){
			samePosCount++;
		}
	}
	if( isNew)
		arrCarPosInCard[nCurrentUser] = samePosCount;
	var position = $("#cardContainer"+nCardNumber).position();
	nleft = position.left - 320;
	ntop = position.top;
	if( ((nCardNumber >= 0) && (nCardNumber < 5)) || (nCardNumber >= 15)){
		ntop -= 50;
		ntop -= 50 * parseInt( arrCarPosInCard[nCurrentUser] / 2);
		nleft += 50 * parseInt(arrCarPosInCard[nCurrentUser] % 2);
	} else if( (nCardNumber >= 5) && (nCardNumber < 7)){
		nleft += 160;
		ntop -= 50 * parseInt( arrCarPosInCard[nCurrentUser] / 2);
		nleft += 50 * parseInt(arrCarPosInCard[nCurrentUser] % 2);
	} else if( (nCardNumber >= 7) && (nCardNumber <= 10)){
		ntop += 70;
		ntop += 50 * parseInt( arrCarPosInCard[nCurrentUser] / 2);
		nleft += 50 * parseInt(arrCarPosInCard[nCurrentUser] % 2);
	} else{
		nleft -= 50;
		ntop += 50 * parseInt( arrCarPosInCard[nCurrentUser] / 2);
		nleft -= 50 * parseInt(arrCarPosInCard[nCurrentUser] % 2);
	}
	return {left:nleft, top:ntop};
}
function fillImageCards(){
	for ( i =  0; i < 19; i++){
		$("#cardContainer"+i).find(".front").css('background-image', 'url("assets/img/card-img/card-img-0'+(i % 6+ 1)+'.png")');
	}
	$("#cardContainer0").find(".front").html('Start');
	$("#cardContainer18").find(".front").html('Finish');
}
fillImageCards();

function refreshTopicList(){
	jQuery.ajax({
		type: 'POST',
		url: 'topicManager.php',
		dataType: 'json',
		data: { getTopics: "getTopics"},
		success: function(obj, textstatus){
			var strHtml = "";
			for( i = 0; i < obj.length; i++){
				strHtml += "<option>" + obj[i] + "</option>";
			}
			$("#topicList").html(strHtml);
		}
	});
}
refreshTopicList();
$(".start_Btn").on('click', function(){
	$(".flip-container").removeClass("hover");
	g_topicName = getSelectedTopicName();
	if(g_topicName == ""){
		alert("Please select a topic.");
		return;
	}
	$(".player").removeClass("ShowItem");
	$(".player").addClass("HideItem");
	arrCars = [];
	arrCurStep = [];
	arrCarPosInCard = [];
	nAllUserCount = 0;
	$(".answerList").html("");
	nBoardImgNo = Math.floor((Math.random() * 9) + 1);
	setBackgroundImg( nBoardImgNo);
	arrQuestionNumbers = [];
	setContentsToCards(g_topicName, arrQuestionNumbers);

	nCurPlayingCount = 0;
	nCurrentUserNumber = 0;
	arrPlayerNames = [];

	addUser("player1");
	if ($('input[name="playerCount"]:checked').val() == '1player') {
		console.log("1player");
	} else{
		addUser("player2");
		console.log("2player");
	}
	SetUserTurn("player1");
	isCanPlay = true;
})
function SetUserTurn(_name){
	$(".onesTurn").removeClass("HideItem");
	$(".onesTurn").addClass("ShowItem");
	$("#turnUserName").html(_name + "`s ");
}