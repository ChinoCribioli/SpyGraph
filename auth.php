<?php
require 'vendor/autoload.php';

$session = new SpotifyWebAPI\Session(
    'ab57d209083846459efd255b1b62b4d5',
    '237e31d7c23e4265af9d5367ff02ce86',
    //'https://developer.spotify.com/dashboard/applications/ab57d209083846459efd255b1b62b4d5'
    'https://spoti-graph.herokuapp.com/test.html'
);

$state = $session->generateState();
$options = [
    'scope' => [
        'playlist-read-private',
        'user-read-private',
    ],
    'state' => $state,
];

header('Location: ' . $session->getAuthorizeUrl($options));
die();
?>