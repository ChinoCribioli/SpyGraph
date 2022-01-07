<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);
require_once("vendor/autoload.php");//https://stackoverflow.com/questions/65160203/fatal-error-uncaught-error-class-ds-map-not-found-php
$servername = "us-cdbr-east-04.cleardb.com";
$username = "bd2be9a1853f00";
$password = "608acbeb";
$dbname = "heroku_a7020db6550b501";
$a1 = $_POST['artist1'];
$a2 = $_POST['artist2']; //sanitizar estos dos!!!

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname); //https://devcenter.heroku.com/articles/cleardb#using-cleardb-with-php
// Check connection
if (!$conn) {
  die(json_encode([
    'error' => "Connection failed: " . mysqli_connect_error(),
  ]));
}

//I will make a bfs with two sources: artist1 and artist2, to find the shortest path between them

$queue = new \Ds\Queue();
$queue->push($a1);
$queue->push($a2);
$parent = array(
  $a1 => $a1,
  $a2 => $a2,
);
$component = array(
  $a1 => 1,
  $a2 => 2,
);
$song_connecting = array();//$song_connecting['artist'] will contain the song connecting artist with its parent

$answer = array(); //this will indicate the path connecting $a1 and $a2 if it exists

while( ! $queue->isEmpty() ){
  $current = $queue->pop();
  $sql = "SELECT * FROM relations WHERE Artist1 = '$current' OR Artist2 = '$current';";
  $result = mysqli_query($conn, $sql);
  while ($row = $result->fetch_assoc()){
    $new_artist = "";
    if($row['Artist1'] == $current) $new_artist = $row['Artist2'];
    else $new_artist = $row['Artist1'];
    if(isset($parent[$new_artist])){
      if($component[$new_artist] != $component[$current]){
        $answer[] = $new_artist;
        $answer[] = $current; //we found two artist in different components that are connected
        $answer[] = $row['Song_Connecting'];
        //$answer contains: {artist of the component of artist1, artist of the component of artist2, the song connecting them} in that order
        break 2;
      }
      continue;
    }
    $parent[$new_artist] = $current;
    $component[$new_artist] = $component[$current];
    $song_connecting[$new_artist] = $row['Song_Connecting'];
    $queue->push($new_artist);
  }
}
if( ! isset($answer[0]) ){
  echo json_encode([
    'error' => 'These artist are not in the same component.',
  ]);
}
else {
  $artists_path = array();
  $songs_path = array();
  $current = $answer[0];
  while($current != $parent[$current]){
    $artists_path[] = $current;
    $songs_path[] = $song_connecting[$current];
    $current = $parent[$current];
  }
  $artists_path[] = $current; //add one end of the path
  $artists_path = array_reverse($artists_path);
  $songs_path = array_reverse($songs_path);
  $songs_path[] = $answer[2];
  $current = $answer[1];
  while($current != $parent[$current]){
    $artists_path[] = $current;
    $songs_path[] = $song_connecting[$current];
    $current = $parent[$current];
  }
  $artists_path[] = $current; //add the other end of the path
  //return artist_path and songs_path
  
  echo json_encode([
    'artists_path' => $artists_path,
    'songs_path' => $songs_path,
    'error' => null,
  ]);
}

mysqli_close($conn);
?>