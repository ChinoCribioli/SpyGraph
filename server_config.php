<?php
// $servername = "us-cdbr-east-04.cleardb.com";
// $username = "bd2be9a1853f00";
// $password = "608acbeb";
// $dbname = "heroku_a7020db6550b501";

$url = parse_url(getenv("CLEARDB_DATABASE_URL"));

$servername = $url["host"];
$username = $url["user"];
$password = $url["pass"];
$dbname = substr($url["path"], 1);

?>