<?php
session_start();
if(!isset($_SESSION['fileMger'])){
	$_SESSION['fileMger'] = array();
}

function rndJesus(){
	$rnd = rand(10, 999999999999999);
	if($rnd < 0 ){
		$rnd *= -1;
	}
	return $rnd;
}

//Reference and code from https://www.w3schools.com/php/php_file_upload.asp
$target_dir = "../../uploads";
$extention = rndJesus();
$uploadOk = 1;
$uploadName = basename($_FILES["file"]["name"]);
$fileType = pathinfo($uploadName,PATHINFO_EXTENSION);
$target_file = "$target_dir/$extention.$fileType";

$jsonReturn = "{ ";
// Check if file already exists
while (file_exists($target_file)) {
	$extention = rndJesus();
	$target_file = $target_dir . $extention . $fileType;
}
// Check file size
if ($_FILES["file"]["size"] > 10000000) {
    $jsonReturn = $jsonReturn . '"error-size": true, ';
    $uploadOk = 0;
}
// Allow certain file formats
if($fileType != "mp3" && $fileType != "ogg" && $fileType != "wav") {
	$jsonReturn = $jsonReturn . '"error-type": true, ';
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    $jsonReturn = $jsonReturn . '"error": true';
} else {
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
		$jsonReturn = $jsonReturn . '"error": false, ';
		$jsonReturn = $jsonReturn . '"url": ' . '"uploads/' . $extention . '.' . $fileType . '", ';
		$jsonReturn = $jsonReturn . '"success": true ';
		$_SESSION['fileMger'][count($_SESSION['fileMger'])] = $extention . '.' . $fileType;
    } else {
		$jsonReturn = $jsonReturn . '"error-moving": true, ';
		$jsonReturn = $jsonReturn . '"error": true ';
    }
}
$jsonReturn = $jsonReturn . '}';
echo $jsonReturn;
?>
