<?php

require_once('common.php');

$trackId = $_POST['trackId'];

$track = $api->getTrack($trackId);
upload_song($track->id,$track->artists,$track->popularity);
echo json_encode([
    'error' => null,
]);

?>