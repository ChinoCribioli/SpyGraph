<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
include("auth.php"); //set the access token
include("upload_song.php");
$playlistId = $_POST['playlistId'];
$isPlaylist = $_POST['isPlaylist'];
echo $isPlaylist . "\n";

if($isPlaylist){
    echo "entre: $isPlaylist \n";
    $songs = $api->getPlaylist($playlistId)->tracks;
}
else{
    $songs = $api->getAlbum($playlistId)->tracks;
}
foreach($songs as $track){
    upload_song($track->id,$api);
}
?>