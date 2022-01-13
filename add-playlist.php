<?php
require_once('common.php');

$playlistId = $_POST['playlistId'];
$isPlaylist = $_POST['isPlaylist'];
$len;
if($isPlaylist == 'true'){//it's an string so I have to compare it with "true"
    $songs = $api->getPlaylist($playlistId)->tracks->items;
    $len = count($songs);
    for($i = 0 ; $i < $len; $i++){
        $track = $songs[$i]->track;
        upload_song($track->id,$track->artists,$track->popularity);
    }
}
else{
    $songs = $api->getAlbum($playlistId)->tracks->items;
    $len = count($songs);
    for($i = 0 ; $i < $len ; $i++){
        $track = $api->getTrack($songs[$i]->id);//the tracks in the album don't have popularity entry, so I have to make another query to get that
        upload_song($track->id,$track->artists,$track->popularity);
    }
}
echo json_encode([
    'error' => null,
    'count' => $len,
]);
?>