<?php
require_once('common.php');
$a1 = $_POST['artist1'];
$a2 = $_POST['artist2'];
//podria chequear si cumple la forma de un id con una expresion regular

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
  //the question marks are to sanitize the variables
  $sql = "SELECT * FROM relations WHERE Artist1 = ? OR Artist2 = ?;";
  //here I make the connection with the database in a secure way
  $statement = mysqli_prepare($conn, $sql);
  mysqli_stmt_bind_param($statement, 'ss', $current, $current);
  mysqli_stmt_execute($statement);
  $result = $statement->get_result();

  // $result = mysqli_query($conn, $sql);
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
  $i = 0;
  for(; $i < count($songs_path) ; $i++){
    $artists_path[$i] = $api->getArtist($artists_path[$i])->name;
    $songs_path[$i] = $api->getTrack($songs_path[$i])->name;
  }
  $artists_path[$i] = $api->getArtist($artists_path[$i])->name;

  echo json_encode([
    'artists_path' => $artists_path,
    'songs_path' => $songs_path,
    'error' => null,
  ]);
}

mysqli_close($conn);
?>