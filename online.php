<!DOCTYPE html>
<html>
<head>
	<title>Online Board Game</title>
	<link rel="stylesheet" href="assets/css/index.css?<?= time(); ?>">
	<link rel="stylesheet" href="assets/css/dice_style.css?<?= time(); ?>">
	<link rel="stylesheet" href="assets/css/flip_style.css?<?= time(); ?>">
</head>
<div class="game_container">


	<div class="stepPanel customPanel">
		<div class="stepLeftPanel">
			<div class="steps step1">
				<h3>Step 1</h3>
				<p>Enter your name</p>
				<input type="text" name="myName" id="myName" class="myName" onkeypress="myNameEntered(event)">
				<div class="ok_Btn action_Btn">OK</div>
				<div style="clear: both;"></div>
			</div>
			<div class="steps step2">
				<h3>Step 2</h3>
				<p>Choose a topic</p>
				<select id="topicList" name="tpoicList" multiple class="topicList customList"></select>
			</div>
			<input type="checkbox" name="reqTxt" value="reqTxt" style="width: 25px; height: 25px;float:left; margin-top: 5px;" onclick="checkHandle(this)">
			<p style="float: left;margin-top: 7px;">Require Text</p>
			<div style="clear: both;"></div>
		</div>
		<div class="stepRightPanel">
			<div class="steps step3">
				<h3>Step 3 <span id="yourName"></span></h3>
				<p>Invite friend(s)</p>
				<select id = "curUsers" name="users" multiple class="allUsersList customList">
				</select>
			</div>
			<div class="steps step4">
				<div class="btnGo action_Btn">send invite</div>
			</div>
			<div class="curUsersPanel customPanel">
				<h4>When member are ready press play</h4>
				<div id = "playingUsers" name="playingUsers" class="playingUsersList customList"></div>
				<div class="start_Btn action_Btn" style="float: left;">Play</div>
				<div class="exit_Btn action_Btn" style="float: left;">Exit</div>
			</div>			
		</div>
		<div style="clear: both;"></div>
		<div class="answerPanel">
			<h3>Question and Answers</h3>
			<div class="answerList">
			</div>
		</div>
	</div>

	<div class="boardPanel customPanel">
		<div class="dice_board">
			<div class="dice_container">
				<section class="dice-container">
					<div id="dice" class="show-front">
						<figure class="front"></figure>
						<figure class="back"></figure>
						<figure class="right"></figure>
						<figure class="left"></figure>
						<figure class="top"></figure>
						<figure class="bottom"></figure>
					</div>
				</section>
				<p>Press to roll</p>
			</div>
			<div class="dice_number_container" style="display: none;">
				<div class="dice_number dicNum">0</div>
				<p>Move <span class="dicNum">0</span> spaces</p>
			</div>
			<div style="clear: both;"></div>
		</div>
		<div class="carContainer">
			<div id="player1" class="player HideItem">
				<p class="playerName"></p>
				<div class="playerImage"></div>
			</div>
			<div id="player2" class="player HideItem">
				<p class="playerName"></p>
				<div class="playerImage"></div>
			</div>
			<div id="player3" class="player HideItem">
				<p class="playerName"></p>
				<div class="playerImage"></div>
			</div>
			<div id="player4" class="player HideItem">
				<p class="playerName"></p>
				<div class="playerImage"></div>
			</div>
		</div>
		<div class="game_board">
			<div>
				<table id="cardTable">
					<?php
					$number = -1;
					$arrCardNumbers = array();
					for( $i = 0; $i < 7; $i ++)
						array_push($arrCardNumbers, $i);
					for( $i = 11; $i >= 7; $i--)
						array_push($arrCardNumbers, $i);
					for( $i = 12; $i < 19; $i ++)
						array_push($arrCardNumbers, $i);

					for ($row=0; $row < 7; $row++) { 
						echo "<tr>";
						for ($col=0; $col < 5; $col++) {
							if($row == 1 || $row == 2) {
								if($col < 4){
									echo "<td></td>";
									continue;
								}
							}
							if($row == 4 || $row == 5){
								if($col >= 1){
									echo "<td></td>";
									continue;
								}
							}
							echo "<td>";
							$number++;
							?>
			<div id="cardContainer<?= $arrCardNumbers[$number] ?>" cardid="<?= $arrCardNumbers[$number] ?>" class="flip-container" >
				<div class="flipper">
					<div class="front">
					</div>
					<div class="back">
						<p class="questionTxt" style="margin: 0px;padding: 0px;text-align: center;"></p>
					</div>
				</div>
			</div>
							<?php
							echo "</td>";
						}
						echo("</tr>");
					}
					?>
				</table>
			</div>
		</div>
	</div>

	<div class="onesAnswer">
		<div class="onesTurn HideItem"><span id="turnUserName">Wang's</span> Turn</div>
		<p>Answer</p>
		<input type="text" name="myAnswer" id="myAnswer" disabled>
	</div>
	<div class="dice_Next_Container">
		<div class="dice_Btn action_Btn">NEXT</div>
		<p style="display: none;">After you answer the question press NEXT</p>
	</div>
	<div style="clear: both;"></div>

	<div class="ani-gif-cong ani-gif HideItem">
		<img src="assets/img/ani-gif/ani-cong.gif">
	</div>
	<div class="ani-gif-star ani-gif HideItem">
		<img src="assets/img/ani-gif/ani-star.gif">
	</div>
	
<audio preload="auto">
	<source src="assets/sound/dice-sound.mp3"></source>
</audio>
<audio preload="auto">
	<source src="assets/sound/Success_128.mp3"></source>
</audio>

<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
<script type="text/javascript">
		var socket = io.connect('http://stctravel.herokuapp.com:80');
</script>
<script src="assets/js/jquery.min.js"></script>
<script  src="assets/js/index.js?<?= time() ?>"></script>
<script  src="assets/js/dice.js?<?= time() ?>"></script>
<script  src="assets/js/communication.js?<?= time() ?>"></script>

</div>
</html>