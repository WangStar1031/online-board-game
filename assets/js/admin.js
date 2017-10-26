function userNameKeyPress(event){
	if(event.keyCode == 13){
		$("#passTxt").focus();
	}
}
function userPassKeyPress(event){
	if(event.keyCode == 13){
		if(verifyUserInfo()){
			$(".Login").removeClass("Show");
			$(".Login").addClass("Hidden");
			$(".adminPanel").removeClass("Hidden");
			$(".adminPanel").addClass("Show");
		} else{
			alert("Invalid User Name and Password.");
		}
	}
}
function verifyUserInfo(){
	var fileContents = $("#userInfo").html();
	var res = fileContents.split(" ");
	var userName = res[0];
	var userPass = res[1];
	if( userName == $("#userTxt").val() && userPass == $("#passTxt").val()){
		return true;
	}
	return false;
}
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
			$("#topics").html(strHtml);
		}
	});
}
refreshTopicList();
$("#topicDel").on("click", function(){
	var el = document.getElementById("topics");
	var options = el && el.options;
	for( var i = 0, iLen = options.length; i<iLen; i++){
		opt = options[i];
		if( opt.selected){
			jQuery.ajax({
				type: 'POST',
				url: 'topicManager.php',
				data: {delTopic: opt.text},
				success: function(obj, textstatus){
					setTimeout(function(){
						refreshTopicList();
					}, 2000);
				}
			});
			return;
		}
	}
})
$("#topicModify").on("click", function(){
	var el = document.getElementById("topics");
	var options = el && el.options;
	for( var i = 0, iLen = options.length; i<iLen; i++){
		opt = options[i];
		if( opt.selected){
			var topicName = prompt("Please enter the new topic Name.", "");
			if( topicName != null){
				var el = document.getElementById("topics");
				var options = el && el.options;
				for( var i = 0, iLen = options.length; i<iLen; i++){
					opt = options[i];
					if( opt.selected){
						jQuery.ajax({
							type: 'POST',
							url: 'topicManager.php',
							data: {modigyTopic:opt.text, newTopic:topicName},
							success: function(obj, textstatus){
								setTimeout(function(){
									refreshTopicList();
								}, 2000);
								
							}
						});
						return;
					}
				}
			}
		}
	}
})

$("#topicAdd").on("click", function(){
	var topicName = prompt("Please enter the new topic Name.", "");
	if( topicName != null){
		var el = document.getElementById("topics");
		var options = el && el.options;
		for( var i = 0, iLen = options.length; i<iLen; i++){
			opt = options[i];
			if( opt.txt == topicName){
				alert("Exist Topic Name!");
				return;
			}
		}
		jQuery.ajax({
			type: 'POST',
			url: 'topicManager.php',
			data: {addTopic:topicName},
			success: function(obj, textstatus){
				setTimeout(function(){
					refreshTopicList();
				}, 2000);
				
			}
		});
	}
})
function getSelectedTopicName(){
	console.log("getSelectedTopicName");
	var el = document.getElementById("topics");
	var options = el && el.options;
	for( var i = 0, iLen = options.length; i<iLen; i++){
		opt = options[i];
		if( opt.selected){
			return opt.text;
		}
	}
	return "";
}

$("#questionDel").on("click", function(){
	var topicName = getSelectedTopicName();
	if( topicName == ""){
		alert("Please select topic!");
		return;
	}
	var el = document.getElementById("question");
	var options = el && el.options;
	for( var i = 0, iLen = options.length; i<iLen; i++){
		opt = options[i];
		if( opt.selected){
			jQuery.ajax({
				type: 'POST',
				url: 'topicManager.php',
				data: {delQuestion: topicName, question: opt.text},
				success: function(obj, textstatus){
					console.log(obj);
					setTimeout(function(){
						refreshContents(topicName);
					}, 2000);
				}
			});
			return;
		}
	}
})
$("#questionAdd").on("click", function(){
	var topicName = getSelectedTopicName();
	if( topicName == ""){
		alert("Please select topic!");
		return;
	}
	var el_q = document.getElementById("questions");
	jQuery.ajax({
		type: 'POST',
		url: 'topicManager.php',
		data: {addQuestion:topicName, question:$("#questions").val()},
		success: function(obj, textstatus){
			setTimeout(function(){
				refreshContents(topicName);
			}, 2000);			
		}
	});
})
function refreshContents(strTopic){
	jQuery.ajax({
		type: 'POST',
		url: 'topicManager.php',
		data: { getContents: strTopic},
		success: function(obj, textstatus){
			var arrRet = obj.split("\n");
			$("#questions").val(obj);
		}
	});
}
function topicChanged(){
	var el = document.getElementById("topics");
	var options = el && el.options;
	for( var i = 0, iLen = options.length; i<iLen; i++){
		opt = options[i];
		if( opt.selected){
			refreshContents(opt.text);
			return;
		}
	}
}