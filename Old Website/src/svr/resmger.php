<?php
	session_start();
	if(isset($_SESSION['fileMger'])){
		foreach($_SESSION['fileMger'] as $file){
			unlink("../../uploads/". $file);
		}
		$session_unset();
		$session_destroy();
	}
?>
