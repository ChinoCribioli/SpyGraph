<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
include("auth.php"); //set the access token
include("upload_song.php");
$playlistId = $_POST['playlistId'];
$isPlaylist = $_POST['isPlaylist'];
if($isPlaylist == 'true'){//it's an string so I have to compare it with "true"
    $songs = $api->getPlaylist($playlistId)->tracks;
}
else{
    $songs = $api->getAlbum($playlistId)->tracks;
}
//var_dump($songs);
foreach($songs as $track){
    var_dump($track);
    upload_song($track->id,$api);
}
?>