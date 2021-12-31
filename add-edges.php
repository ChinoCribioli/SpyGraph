<?php
$servername = "us-cdbr-east-04";//.cleardb.com";
$username = "bd2be9a1853f00";
$password = "608acbeb";
$dbname = "ClearDB";
$artist1 = $_POST['artist1'];
$artist2 = $_POST['artist2'];
$trackId = $_POST['trackId'];
$popularity = $_POST['popularity'];

echo "hasta aca llega \n";

// Create connection
//$conn = mysqli_connect($servername, $username, $password, $dbname);
$conn = new mysqli($servername, $username, $password, $dbname); //https://devcenter.heroku.com/articles/cleardb#using-cleardb-with-php
// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT * FROM relaciones WHERE Artist1 = " + $artist1 + " AND Artist2 = " + $artist2;
$result = mysqli_query($conn, $sql);

if(mysqli_num_rows($result) == 0){
  $sql = "INSERT INTO relaciones (Artist1, Artist2, Song_Connecting, Popularity) VALUES ($artist1 , $artist2 , $trackId , $popularity)";
  $fill_database = mysqli_query($conn, $sql);
}
else if(mysqli_num_rows($result) > 1){
  echo "Error: more than one row with the same edge in the graph.";
}
else {
  $row = $result->fetch_assoc();
  $current_popularity = $row["Popularity"];
  if($current_popularity < $popularity){
    $sql = "UPDATE relaciones SET Song_Connecting = " + $trackId + " WHERE Artist1 = " + $artist1 + " AND Artist2 = " + $artist2;
    $update_database = mysqli_query($conn, $sql);
    $sql = "UPDATE relaciones SET Popularity = " + $popularity + " WHERE Artist1 = " + $artist1 + " AND Artist2 = " + $artist2;
    $update_database = mysqli_query($conn, $sql);
  }
}

mysqli_close($conn);
?>