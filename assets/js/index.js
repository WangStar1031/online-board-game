var arrCars = [];
var arrCurStep = [];
var arrCarPosInCard = [];
var nCurrentUserNumber = -1;
var nMaxNumber = 4;
var nAllUserCount = 0;
var nCurPlayingCount = 0;
var userName = "";
//var arrCarColors = ["#DA3832","#3775B6","#3C914D","#000"];
var arrPlayerNames = [];
var arrUsers = [];
var isCanPlay = false;
var gameState = false;
var arrInviteSendUsers = [];
var nBoardImgNo = 0;
var topicName = "";
var arrQuestionNumbers = [];
var isMaster = false;
var masterUserName = "";
var isPlaying = false;
function joinToGame(){
	var elem = document.getElementById("myName");
	for( i = 0; i < arrUsers.length; i++){
		if(arrUsers[i].name == elem.value){
			alert("Exist user name!");
			return;
		}
	}
	userName = elem.value;
	$("#yourName").html(userName);
}
function myNameEntered(event){
	if(event.keyCode == 13){
		joinToGame();
	}
}
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
	isCanPlay = false;
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
				isCanPlay = true;
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
				isCanPlay = false;
			}
			for( i = 1; i < 18; i++){
				$("#cardContainer"+i).find(".questionTxt").html(arrContents[arrQuestionNumbers[i-1]]);
			}
			sendInvitation();
		}
	});
}
function setBackgroundImg(nImgNo){
	$(".game_container").css('background-image', 'url("assets/img/bg-img/background-0' + nBoardImgNo + '.png")');
}
$(".ok_Btn").on("click", function(){
	joinToGame();
})
$(".btnGo").on("click", function(){
	g_topicName = getSelectedTopicName();
	if(userName == ""){
		alert("Please enter your ID or Name.");
		return;
	}
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
	isMaster = true;
	$(".answerList").html("");
	masterUserName = userName;
	nBoardImgNo = Math.floor((Math.random() * 9) + 1);
	setBackgroundImg( nBoardImgNo);
	initAllCurrentUsers();
	arrQuestionNumbers = [];
	setContentsToCards(g_topicName, arrQuestionNumbers);
});
function addUser(_name){
	if( _name != userName){

	}
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
	addUser2List(_name);
}
function addUser2List(_name){
	$("#playingUsers").append("<p id='playing_"+_name+"'>"+_name+"</p>");
//	arrPlayerNames.push(_name);
}
$(".dice_Btn").on("click", function(){	//NEXT button
	if( $("#myAnswer").val() == "" && document.getElementById("myAnswer").disabled == false){
		alert("Please enter the answer.");
		return;
	}
	var _answer = $("#myAnswer").val();
	$("#myAnswer").val("");
	$(".flip-container").removeClass("hover");
	sendNextTurnMsg(_answer);
});
function sendNextTurnMsg(_answer){
	if( gameState == false)	{
		var strHtml = '<p>A:' + _answer +'</p>';
		$(".answerList").append(strHtml);
		isCanPlay = true;
		return;
	}
	nCurrentUserNumber ++;
	nCurrentUserNumber %= nAllUserCount;
	setUserTurn( arrPlayerNames[nCurrentUserNumber], _answer);
}

function gotoStep(carName, number){
	isCanPlay = false;
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
	var stepNumber = gotoStep(userName, number);
	console.log("Rolled Number : "+stepNumber);
	var question = $("#cardContainer"+stepNumber).find(".questionTxt").html();
	var strHtml = '<p>Q:' + question +'</p>';
	$(".answerList").append(strHtml);
	sendMyDiceNumber(number);
}
function rolledDiceNameNumber(_name,_number){
	nCurrentUserNumber++;
	nCurrentUserNumber %= nCurPlayingCount;
	var stepNumber = gotoStep(_name, _number);
	var question = $("#cardContainer"+stepNumber).find(".questionTxt").html();
	var strHtml = '<p >' + question +'</p>';
	$(".answerList").append(strHtml);
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
	nleft = position.left - 500;
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
function fillColorCards(){
	$("#cardContainer0").find(".front").css('background-color', '#DF633B');
	$("#cardContainer0").find(".front").html('Start');
	$("#cardContainer1").find(".front").css('background-color', '#86328B');
	$("#cardContainer2").find(".front").css('background-color', '#41A59D');
	$("#cardContainer3").find(".front").css('background-color', '#3C914D');
	$("#cardContainer4").find(".front").css('background-color', '#DA3832');
	$("#cardContainer5").find(".front").css('background-color', '#FFF24B');
	$("#cardContainer6").find(".front").css('background-color', '#DA407B');
	$("#cardContainer7").find(".front").css('background-color', '#DF633B');
	$("#cardContainer8").find(".front").css('background-color', '#86328B');
	$("#cardContainer9").find(".front").css('background-color', '#41A59D');
	$("#cardContainer10").find(".front").css('background-color', '#3C914D');
	$("#cardContainer11").find(".front").css('background-color', '#DA3832');
	$("#cardContainer12").find(".front").css('background-color', '#FFF24B');
	$("#cardContainer13").find(".front").css('background-color', '#DA407B');
	$("#cardContainer14").find(".front").css('background-color', '#86328B');
	$("#cardContainer15").find(".front").css('background-color', '#41A59D');
	$("#cardContainer16").find(".front").css('background-color', '#3C914D');
	$("#cardContainer17").find(".front").css('background-color', '#DA3832');
	$("#cardContainer18").find(".front").css('background-color', '#DF633B');
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
function initAllCurrentUsers(){
	$("#playingUsers").html("");
	arrPlayerNames = [];
	nCurPlayingCount = 0;
	if( userName != "")
		addUser(userName);
	else
		addUser("ME");
}
function userAccepted(_userName) {
	addUser(_userName);
}
function sendInvitation(){
	console.log("sendInvitation");
	arrInviteSendUsers = [];
	var el = document.getElementById("curUsers");
	var options = el && el.options;
	for( var i = 0, iLen = options.length; i<iLen; i++){
		opt = options[i];
		if( opt.selected){
			arrInviteSendUsers.push(opt.text.substring(0, opt.text.indexOf(':')));
			if( nCurrentUserNumber == 3)break;
		}
	}
	if( arrInviteSendUsers.length == 0){
		isCanPlay = true;
		return;
	}
	gameState = true;
	__user_obj = {'type':'invite_send', 'masterName':userName, 'otherNames':arrInviteSendUsers.join(','), boardImgNo:nBoardImgNo, topicName:g_topicName, questions: arrQuestionNumbers.join(',')};
	socket.emit('sentence message', JSON.stringify(__user_obj));
	isCanPlay = true;
	isPlaying = false;
}
$(".start_Btn").on('click', function(){
	if(isMaster == false)return;
	if(isPlaying == true)return;
	isPlaying = true;
	__user_obj = {'type':'start_game', 'masterName':userName, 'userNames':arrPlayerNames.join(',')};
	socket.emit('sentence message', JSON.stringify(__user_obj));
	setTimeout(function(){
		setUserTurn(userName,'');
	},1000);
})
$(".exit_Btn").on('click', function(){
	if( gameState == false)return;
	gameState = false;
	isPlaying = false;
	__user_obj = {'type':'exit_game', 'masterName':masterUserName, 'userName':userName};
	socket.emit('sentence message', JSON.stringify(__user_obj));
	$("#playingUsers").html("");
	$(".answerList").html("");
	nAllUserCount = 0;
	nCurPlayingCount = 0;
	arrPlayerNames = [];
	arrCarPosInCard = [];
	arrCurStep = [];
})
function setUserTurn(_name, _answer){
	if(isMaster == false){
		__user_obj = {'type':'user_Turn_Slave', 'masterName':masterUserName, 'curUserName': userName,'answer':_answer};
		socket.emit('sentence message', JSON.stringify(__user_obj));
		return;
	}
	__user_obj = {'type':'user_Turn', 'masterName':userName, 'nextUserName':_name, 'answer':_answer};
	socket.emit('sentence message', JSON.stringify(__user_obj));
}
function sendMyDiceNumber(_number){
	if( gameState == false)return;
	__user_obj = {'type':'dice_Number', 'masterName':masterUserName, 'curUserName': userName, 'diceNumber': _number};
	socket.emit('sentence message', JSON.stringify(__user_obj));
}
function checkHandle(checkboxElem){
	if( checkboxElem.checked){
		document.getElementById("myAnswer").disabled=false;
	} else {
		document.getElementById("myAnswer").disabled=true;
	}
}