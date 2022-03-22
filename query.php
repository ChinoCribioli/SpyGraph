<?php
require_once('server_config.php');
$a1 = $_POST['artist1'];
$a2 = $_POST['artist2'];

//I will make a bidirectional swarm algorithm with artist1 and artist2 as the two sources to find the shortest path between them


$queue = new \Ds\Queue();
$queue->push($a1);//initially, push the two sources in the queue
$queue->push($a2);
$parent = array(//this keeps track of the parent of each node
  $a1 => $a1,
  $a2 => $a2,
);
$component = array(
  $a1 => 1,
  $a2 => 2,
);
$song_connecting = array();//$song_connecting['artist'] will contain the song connecting artist with its parent

$answer = array();
// this will indicate the path connecting $a1 and $a2 if it exists in the following way:
// It will contain 3 elements, 2 nodes and an edge. The nodes will be from different components,
// so the path will have three parts: the parents path from node 1 to source 1, the edge
// connecting the two nodes, and the parents path from node 2 to source 2 

while( ! $queue->isEmpty() ){
  $current = $queue->pop();
  //the question marks are to sanitize the variables
  $sql = "SELECT Artist1, Artist2, Song_Connecting FROM relations WHERE Artist1 = ? OR Artist2 = ?;";
  //here I make the connection with the database in a secure way
  $statement = mysqli_prepare($conn, $sql);
  //and here I fill the query with the values I want. 'ss' means that the paremeters are going to be two strings.
  mysqli_stmt_bind_param($statement, 'ss', $current, $current);
  mysqli_stmt_execute($statement);
  $result = $statement->get_result();

  while ($row = $result->fetch_assoc()){//now, analyze the edges going out of $current
    $new_artist = "";//this will be the other node connected to $current by the current edge
    if($row['Artist1'] == $current) $new_artist = $row['Artist2'];
    else $new_artist = $row['Artist1'];
    if(isset($parent[$new_artist])){//if it has a parent, I see its component
      if($component[$new_artist] != $component[$current]){//if it's different form current's, I found a solution
        $answer[] = $new_artist;
        $answer[] = $current; //we found two artist in different components that are connected
        $answer[] = $row['Song_Connecting'];
        //$answer contains: {artist of the component of artist1, artist of the component of artist2, the song connecting them} in that order
        break 2;
      }
      //if not, do nothing
      continue;
    }
    //if I didn't been in this node yet, set its parent and component
    $parent[$new_artist] = $current;
    $component[$new_artist] = $component[$current];
    $song_connecting[$new_artist] = $row['Song_Connecting'];
    $queue->push($new_artist);
  }
}
if( ! isset($answer[0]) ){//If I don't have an answer, return the error
  echo json_encode([
    'error' => 'These artist are not in the same component.',
  ]);
}
else {//If I have an answer, reconstruct the path
  $artists_path = array();//this variable will have the path of artists
  $songs_path = array();//and this will have the songs connecting those artists
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
  for(; $i < count($songs_path) ; $i++){//I return only the names and id's of the artists and songs
    $artists_path[$i] = [$api->getArtist($artists_path[$i])->name,$artists_path[$i]];
    $songs_path[$i] = [$api->getTrack($songs_path[$i])->name,$songs_path[$i]];
  }
  $artists_path[$i] = [$api->getArtist($artists_path[$i])->name,$artists_path[$i]];

  echo json_encode([
    'artists_path' => $artists_path,
    'songs_path' => $songs_path,
    'error' => null,
  ]);
}
?>