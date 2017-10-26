<!DOCTYPE html>
<html>
<head>
	<title>Offline Board Game</title>
	<link rel="stylesheet" href="assets/css/index_offline.css?<?= time(); ?>">
	<link rel="stylesheet" href="assets/css/dice_style.css?<?= time(); ?>">
	<link rel="stylesheet" href="assets/css/flip_style.css?<?= time(); ?>">
</head>
<div class="game_container">
	<div class="stepPanel customPanel">
		<div class="stepLeftPanel">
			<div class="steps step1">
				<h3>Step 1</h3>
				<input type="radio" name="playerCount" value="1player" checked="checked">1 player<br>
				<input type="radio" name="playerCount" value="2player">2 player<br>
			</div>
			<div class="steps step2">
				<h3>Step 2</h3>
				<p>Choose a topic</p>
				<select id="topicList" name="tpoicList" multiple class="topicList customList"></select>
			</div>
			<div class="start_Btn action_Btn">Play</div>
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
	</div>
	<div class="dice_Next_Container">
		<div class="dice_Btn action_Btn">NEXT</div>
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

<script src="assets/js/jquery.min.js"></script>
<script  src="assets/js/index_offline.js?<?= time() ?>"></script>
<script  src="assets/js/dice_offline.js?<?= time() ?>"></script>

</div>
</html>