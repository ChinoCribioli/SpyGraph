<?php
require 'vendor/autoload.php';

$session = new SpotifyWebAPI\Session(
    'ab57d209083846459efd255b1b62b4d5',
    '237e31d7c23e4265af9d5367ff02ce86',
    //'https://developer.spotify.com/dashboard/applications/ab57d209083846459efd255b1b62b4d5'
    'https://spoti-graph.herokuapp.com/test.html'
);

$state = $_GET['state'];

// Fetch the stored state value from somewhere. A session for example

if ($state !== $storedState) {
    // The state returned isn't the same as the one we've stored, we shouldn't continue
    die('State mismatch');
}

// Request a access token using the code from Spotify
$session->requestAccessToken($_GET['code']);

$accessToken = $session->getAccessToken();
$refreshToken = $session->getRefreshToken();

// Store the access and refresh tokens somewhere. In a session for example

// Send the user along and fetch some data!
header('Location: add-edges.php');
die();
?>