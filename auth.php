<?php
require 'vendor/autoload.php';

$session = new SpotifyWebAPI\Session(
    'ab57d209083846459efd255b1b62b4d5',
    '237e31d7c23e4265af9d5367ff02ce86',
);

$session->requestCredentialsToken();
$accessToken = $session->getAccessToken();

?>