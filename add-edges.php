<?php
// error_reporting(E_ALL);
// ini_set("display_errors", 1);
include("server_config.php");
$artist1 = $_POST['artist1'];
$artist2 = $_POST['artist2'];
$trackId = $_POST['trackId'];
$popularity = $_POST['popularity'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname); //https://devcenter.heroku.com/articles/cleardb#using-cleardb-with-php
// Check connection
if (!$conn) {
  die(json_encode([
    'error' => "Connection failed: " . mysqli_connect_error(),
  ]));
}

//the question marks are to sanitize the variables
$sql = "SELECT * FROM relations WHERE Artist1 = ? AND Artist2 = ?;";
//here I make the connection with the database in a secure way
$statement = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($statement, 'ss', $artist1, $artist2);
mysqli_stmt_execute($statement);
$result = $statement->get_result();

// $sql = "SELECT * FROM relations WHERE Artist1 = '$artist1' AND Artist2 = '$artist2';";
// $result = mysqli_query($conn, $sql);


if(mysqli_num_rows($result) == 0){
  $sql = "INSERT INTO relations (Artist1, Artist2, Song_Connecting, Popularity) VALUES (?,?,?,?);";
  $statement = mysqli_prepare($conn, $sql);
  mysqli_stmt_bind_param($statement, 'sssi', $artist1, $artist2,$trackId,$popularity);
  mysqli_stmt_execute($statement);
  $result = $statement->get_result();
}
else if(mysqli_num_rows($result) > 1){
  die(json_encode([
    'error' => 'more than one row with the same edge in the graph.',
  ]));
}
else {
  $row = $result->fetch_assoc();
  $current_popularity = $row["Popularity"];
  if($current_popularity < $popularity){
    $sql = "UPDATE relations SET Song_Connecting = ? WHERE Artist1 = ? AND Artist2 = ?;";
    $statement = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($statement, 'sss', $trackId, $artist1, $artist2);
    mysqli_stmt_execute($statement);
    $result = $statement->get_result();
    $sql = "UPDATE relations SET Popularity = ? WHERE Artist1 = ? AND Artist2 = ?;";
    $statement = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($statement, 'iss', $popularity, $artist1, $artist2);
    mysqli_stmt_execute($statement);
    $result = $statement->get_result();
  }
}

echo json_encode([
  'error' => null,
]);

mysqli_close($conn);
?>