<?php
	function addTopic($topicName){
		$myFile = fopen("assets/topics/".$topicName.".txt", "w");
		fclose($myFile);
	}
	function getTopics(){
		$dir = 'assets/topics/';
		$files = scandir($dir);
		$arrRet = array();
		for( $i = 0; $i < count($files); $i ++){
			$fName = $files[$i];
			if( $fName != '.' && $fName != '..'){
				$pos = strpos($fName, ".");
				$buff = substr($fName, 0, $pos);
				array_push($arrRet, $buff);
			}
		}
		return $arrRet;
	}
	function deleteTopics($topicName){
		$fName = 'assets/topics/'.$topicName.'.txt';
		unlink($fName);
	}
	function modifyTopics($topicName, $newTopicName){
		$topicName = 'assets/topics/'.$topicName.'.txt';
		$newTopicName = 'assets/topics/'.$newTopicName.'.txt';
		rename($topicName, $newTopicName);
	}
	if(isset($_POST['delQuestion'])){
		$topicName = $_POST['delQuestion'];
		$question = $_POST['question'];
		$fName = 'assets/topics/'.$topicName.'.txt';
		$contents = file_get_contents($fName);
		$arrQuestions = array();
		$arrQuestions = explode("\n", $contents);
		$newContents = "";
		for ($i=0; $i < count($arrQuestions); $i++) { 
			if( $arrQuestions[$i] == $question)
				continue;
			$newContents .= $arrQuestions[$i]."\n";
		}
		file_put_contents($fName, $newContents);
//		echo $arrQuestions;
	}
	if(isset($_POST['addQuestion'])){
		$topicName = $_POST['addQuestion'];
		$question = $_POST['question'];
		$fName = 'assets/topics/'.$topicName.'.txt';
		file_put_contents($fName, $question);
	}
	if(isset($_POST['modigyTopic'])){
		$topicName = $_POST['modigyTopic'];
		$newTopicName = $_POST['newTopic'];
		modifyTopics($topicName, $newTopicName);
	}
	if( isset($_POST['delTopic'])){
		$topicName = $_POST['delTopic'];
		deleteTopics($topicName);
	}
	if(isset($_POST['getTopics'])){
		//getTopics();
		echo json_encode(getTopics());
	}
	if(isset($_POST['addTopic'])){
		$topicName = $_POST['addTopic'];
		addTopic($topicName);
	}
	if(isset($_POST['getContents'])){
		$topicName = $_POST['getContents'];
		echo file_get_contents('assets/topics/'.$topicName.'.txt');
	}
?>