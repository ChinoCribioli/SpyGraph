<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
include("auth.php"); //set the access token
include("upload_song.php");
$playlistId = $_POST['playlistId'];
$isPlaylist = $_POST['isPlaylist'];
if($isPlaylist == 'true'){//it's an string so I have to compare it with "true"
    $songs = $api->getPlaylist($playlistId)->tracks;
    $songs = $songs->items;
    echo "{ \"errors\" : [";
    for($i = 0 ; $i < count($songs) ; $i++){
        $track = $songs[$i]->track;
        upload_song($track->id,$track->artists,$track->popularity);
        if($i != count($songs)-1) echo ",";
    }
    echo "]}";
}
else{
    $songs = $api->getAlbum($playlistId)->tracks;
    $songs = $songs->items;
    echo "{ \"errors\" : [";
    for($i = 0 ; $i < count($songs) ; $i++){
        $track = $api->getTrack($songs[$i]->id);//the tracks in the album don't have popularity entry, so I have to make another query to get that
        upload_song($track->id,$track->artists,$track->popularity);
        if($i != count($songs)-1) echo ",";
    }
    echo "]}";
}
?>