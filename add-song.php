<?php

require_once('server_config.php');

$trackId = $_POST['trackId'];

$track = $api->getTrack($trackId);
upload_song($track->id,$track->artists,$track->popularity);//call this function to upload the song
echo json_encode([
    'error' => null,
]);

?>