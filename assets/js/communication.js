var arrUsers_total;
var arrUsers;
$(function(){
	arrUsers_total = [];
	function __insert_user(__user, state){
		var __d = new Date();
		var __n = __d.getTime();
		__user_index = -1;
		for(i=0; i<arrUsers_total.length; i++){
			if(arrUsers_total[i].name == __user){
			__user_index = i;
			arrUsers_total[i].live_time = __n;
			arrUsers_total[i].state = state;
			break;
			}
		}
		if(__user_index == -1){
			__new_user = {};
			__new_user.name = __user;
			__new_user.live_time = __n;
			__new_user.state = state;
			arrUsers_total[arrUsers_total.length] = __new_user;
		}
	}
	socket.on('sentence message', function(msg){
		msgObj = JSON.parse(msg);
		if( msgObj.type != 'init')
			console.log(msgObj);
		if(msgObj.type == 'init'){
			__insert_user(msgObj.name, msgObj.state);
			__refresh_users();
		} else if( msgObj.type == 'invite_deny'){
			if( msgObj.masterName == userName){

			}
		} else if( msgObj.type == 'invite_accept'){
			if( msgObj.masterName == userName){
				$(".answerList").html("");
				userAccepted(msgObj.acceptedUserName);
			}

		} else if( msgObj.type == 'invite_send'){
			if(gameState == true){
				return;
			}
			var arrOtherNames = msgObj.otherNames.split(',');
			if( arrOtherNames.indexOf(userName) != -1){
				if( confirm(msgObj.masterName + ' invited you. Are you sure accept?')){
					nBoardImgNo = msgObj.boardImgNo;
					setBackgroundImg( nBoardImgNo);
					g_topicName = msgObj.topicName;
					var arrQuestions = msgObj.questions.split(',');
					setContentsToCards( g_topicName, arrQuestions);
					gameState = true;
					masterUserName = msgObj.masterName;
					sendAcceptMsg();
				}
			}
		} else if( msgObj.type == 'accepted_user'){

		} else if( msgObj.type == 'exit_game'){

		} else if( msgObj.type == 'start_game'){
			if( msgObj.masterName != userName && msgObj.masterName == masterUserName){
				var arrPlayers = msgObj.userNames.split(',');
				nAllUserCount = 0;
				arrPlayerNames = [];
				for( _i = 0; _i < arrPlayers.length; _i++){
					addUser(arrPlayers[_i]);
				}
			}
		} else if( msgObj.type == 'dice_Number'){
			if( msgObj.masterName == masterUserName && msgObj.curUserName != userName){
				rollDiceNameNumber(msgObj.curUserName, msgObj.diceNumber);
			}
		} else if( msgObj.type == 'user_Turn'){
			if( msgObj.masterName == masterUserName){
				if(msgObj.nextUserName == userName){
					isCanPlay = true;
				}
				setCurrentUserName( msgObj.nextUserName, msgObj.answer);
			}
		} else if( msgObj.type == 'user_Turn_Slave'){
			if( msgObj.masterName == userName && msgObj.curUserName != masterUserName){
				sendNextTurnMsg(msgObj.answer);
			}
		}
	});
	function setCurrentUserName( nextUserName, _answer){
		$(".flip-container").removeClass("hover");
		$(".onesTurn").removeClass("HideItem");
		$(".onesTurn").removeClass("ShowItem");
		$("#turnUserName").html(nextUserName + "`s ");
		if( _answer != ''){
			var strHtml = '<p>A:' + _answer +'</p>';
			$(".answerList").append(strHtml);
		}
		var userIndex = arrPlayerNames.indexOf(nextUserName);
		$("#playingUsers p").css("color","black");
		$("#playing_"+nextUserName).css("color","red");
		var strHtml = '<p style="font-weight:bold;">' + nextUserName +'</p>';
		$(".answerList").append(strHtml);
	}
	function sendAcceptMsg(){
		__user_obj = {'type':'invite_accept', 'masterName':masterUserName, 'acceptedUserName':userName};
		console.log(__user_obj);
		socket.emit('sentence message', JSON.stringify(__user_obj));
	}
	function __refresh_users(){
		var __d = new Date();
		var __n = __d.getTime();
		arrUsers = [];
		for ( i = 0; i < arrUsers_total.length; i++){
			if((__n - arrUsers_total[i].live_time < 4000) && (arrUsers_total[i].name != userName)){
				arrUsers[arrUsers.length] = {name:arrUsers_total[i].name, state: arrUsers_total[i].state? "online" : "own"};
			}
		}
		var el = document.getElementById("curUsers");
		arrSelUsers = [];
		var options = el && el.options;
		var opt;
		for( var i = 0, iLen = options.length; i<iLen; i++){
			opt = options[i];
			if( opt.selected){
				arrSelUsers.push( opt.text);
			}
		}
		var strHtml = "";
		for( i = 0; i < arrUsers.length; i++){
			if( arrSelUsers.indexOf(arrUsers[i].name+":"+arrUsers[i].state) != -1){
				strHtml += '<option value="' + arrUsers[i].name + '" selected="selected">' + arrUsers[i].name +":"+ arrUsers[i].state + '</option>';
			}else{
				strHtml += '<option value="' + arrUsers[i].name + '">' + arrUsers[i].name + ":"+ arrUsers[i].state + '</option>';
			}
		}
		el.innerHTML = strHtml;
	}
	setInterval( function(){
		if(userName == ""){
			return;
		}
		__user_obj = {"type":"init", "name": userName, "state": gameState};
		socket.emit('sentence message', JSON.stringify(__user_obj));
	}, 2000);
	setInterval( function(){	// refresh user list
		__refresh_users();
	}, 5000);
})
