<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);
include("auth.php"); //set the access token
include("upload_song.php");
$trackId = $_POST['trackId'];
$track = $api->getTrack($_POST['trackId']);
upload_song($track->id,$track->artists,$track->popularity);

?>