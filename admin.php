<link rel="stylesheet" href="assets/css/admin.css?<?= time(); ?>">
<?php
	$fileContents = file_get_contents("assets/adminInfo/adminInfo.txt");
?>

<div class="Login Hidden">
	<p id = "userInfo" style="display: none;"><?= $fileContents ?></p>
	<table>
		<tr>
			<td>UserName:</td>
			<td><input type="text" name="userNmae" placeholder="Enter Admin Name" id="userTxt" onkeypress="userNameKeyPress(event);"></td>
		</tr>
		<tr>
			<td>PassWord:</td>
			<td><input type="password" name="PassWord" placeholder="Enter PassWord" id="passTxt" onkeypress="userPassKeyPress(event);"></td>
		</tr>
	</table>
</div>
<div class="adminPanel Show">
	<div class="topicContainer">
		<h2>topics</h2>
		<select id = "topics" name="topics" multiple class="topicList customList" onchange="topicChanged()">
		</select>
		<p><span id="topicAdd">add</span><span id="topicDel">del</span><span id="topicModify">modify</span></p>
	</div>
	<div class="questionContainer">
		<h2>questions</h2>
		<textarea id="questions" class="customList questionList"></textarea>
		<!-- <select id = "question" name="question" multiple class="questionList customList">
		</select> -->
		<p><span id="questionAdd">confirm</span><!-- <span id="questionDel">del</span><span id="questionModify">modify</span> --></p>
	</div>
	<div style="clear: both;"></div>
</div>
<script src="assets/js/jquery.min.js"></script>
<script  src="assets/js/admin.js?<?= time() ?>"></script>
