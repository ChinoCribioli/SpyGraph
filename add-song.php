<?php

require_once('server_config.php');

$trackId = $_POST['trackId'];

$track = $api->getTrack($trackId);
upload_song($track->id,$track->artists,$track->popularity);
echo json_encode([
    'error' => null,
]);

?>