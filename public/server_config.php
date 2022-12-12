<?php
// Use with `require_once('common.php')`
// The following envvars should be set with appropiate values:
// CLEARDB_DATABASE_URL
// SPOTIFY_CLIENT_ID
// SPOTIFY_CLIENT_SECRET
//This is going to be included in all the other PHP files
require_once('vendor/autoload.php');

// Set verbose error reporting
// TODO: Set according to DEBUG envvar
error_reporting(E_ALL ^ E_DEPRECATED);
ini_set("display_errors", 1);

// Load DB config
$url = parse_url(getenv("CLEARDB_DATABASE_URL"));
$servername = $url["host"];
$username = $url["user"];
$password = $url["pass"];
$dbname = substr($url["path"], 1);
$conn = new mysqli($servername, $username, $password, $dbname);//set the connection to the database
if (!$conn) {
    die(json_encode([
        'error' => "Connection failed: " . mysqli_connect_error(),
    ]));
}

// Load Spotify config
$session = new SpotifyWebAPI\Session(
    getenv("SPOTIFY_CLIENT_ID"),
    getenv("SPOTIFY_CLIENT_SECRET"),
);
$session->requestCredentialsToken();
$accessToken = $session->getAccessToken();
$api = new \SpotifyWebAPI\SpotifyWebAPI();//set the Spotify API
$api->setAccessToken($accessToken);

// Function definitions
function upload_song($trackId,$artists,$popularity){//the function to upload a song to the database
    global $conn;
    for($i = 0 ; $i < count($artists) ; $i++)for($j = $i+1 ; $j < count($artists) ; $j++){
        //for each pair of artists, add a row connecting them
        $artist1 = $artists[$i]->id;
        $artist2 = $artists[$j]->id;
        if($artist2 < $artist1){//I want artist1 < artist2
            $aux = $artist1;
            $artist1 = $artist2;
            $artist2 = $aux;
        }

        //the question marks are to sanitize the variables
        $sql = "SELECT Popularity FROM relations WHERE Artist1 = ? AND Artist2 = ?;";
        //here I make the connection with the database in a secure way
        $statement = mysqli_prepare($conn, $sql);
        //and now I complete the query with the ids of the artists
        //the 'ss' tells that the entries will be two strings
        mysqli_stmt_bind_param($statement, 'ss', $artist1, $artist2);
        mysqli_stmt_execute($statement);
        $result = $statement->get_result();

        
        if(mysqli_num_rows($result) == 0){//if there are no rows like this, I add one
            $sql = "INSERT INTO relations (Artist1, Artist2, Song_Connecting, Popularity) VALUES (?,?,?,?);";
            $statement = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($statement, 'sssi', $artist1, $artist2,$trackId,$popularity);
            mysqli_stmt_execute($statement);
            $result = $statement->get_result();
        }
        else if(mysqli_num_rows($result) > 1){//if there's more than one, return the error
            die(json_encode([
            'error' => 'more than one row with the same edge in the graph.',
            ]));
        }
        else {//if there's already one, I compare the popularity of the songs and leave the most popular
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
    }
}
?>