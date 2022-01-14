function new_song(link){
  document.getElementById("response").innerHTML = "...";
  var id = /track\/([^/^\s\?]{22})/g.exec(link);//regular expression made with RegExr
  //in Spotify API all ID's are 22 characters long.
  if (id == null){
    document.getElementById('song').value = "";
    document.getElementById("response").innerHTML = "Invalid song :(";
    return;
  }
  id = id[1];//I want the first capture group of the regular expression
  fetch("add-song.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `trackId=${id}`,
  }).then(function(response) {
    if (!response.ok) {
      console.log("HTTP error, status = " + response.status);
    }
    return response.json();
  })
  .then(function(json) {
    console.log(json);
    document.getElementById('song').value = "";
    document.getElementById("response").innerHTML = "Song uploaded!";
  });
}

function new_playlist(link){//or album
  document.getElementById("response").innerHTML = "...";
  var isPlaylist = true; //this variable tells me if the id is from a playlist or an album
  var id = /playlist\/([^/^\s\?]{22})/g.exec(link);//regular expression made with RegExr
  //in Spotify API all ID's are 22 characters long.
  if (id == null){
    isPlaylist = false;
    id = /album\/([^/^\s\?]{22})/g.exec(link);
  }
  if(id == null){
    document.getElementById('playlist').value = "";
    document.getElementById("response").innerHTML = "Invalid playlist or album :(";
    return;
  }
  id = id[1];//I want the first capture group of the regular expression
  fetch("add-playlist.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `playlistId=${id}&isPlaylist=${isPlaylist}`,
  }).then(function(response) {
    if (!response.ok) {
      console.log("HTTP error, status = " + response.status);
    }
    return response.json();
  })
  .then(function(json) {
    console.log(json);
    document.getElementById('playlist').value = "";
    document.getElementById("response").innerHTML = "Playlist uploaded!";
  });
}

function query(artist1, artist2){
  document.getElementById("response").innerHTML = "...";
  var id1 = /artist\/([^/^\s\?]{22})/g.exec(artist1), id2 = /artist\/([^/^\s\?]{22})/g.exec(artist2);
  if(id1 == null){
    document.getElementById("response").innerHTML = "Invalid artist 1 :(";
    return;
  }
  if(id2 == null){
    document.getElementById("response").innerHTML = "Invalid artist 2 :(";
    return;
  }
  id1 = id1[1];
  id2 = id2[1];
  if(id2 < id1) [id1, id2] = [id2, id1]; //a fancy way to swap the id's
  console.log(id1 < id2);
  fetch("query.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `artist1=${id1}&artist2=${id2}`,
  }).then(function(response) {
    if (!response.ok) {
      console.log("HTTP error, status = " + response.status);
    }
    return response.json();
  })
  .then(function(json) {
    console.log(json);//json.artist_path y json.songs_path
    if(json.error){ //if error is not null
      document.getElementById("response").innerHTML = "These artists are not connected for now :( <br>But you can upload more songs or playlists and see if you can connect them!";
      return;
    }
    document.getElementById("response").innerHTML = "We found a path!<br>";
    var songs_path = json.songs_path, artists_path = json.artists_path;
    for(var i = 1 ; i < artists_path.length ; i++){
      document.getElementById("response").innerHTML += `<span style="color:red;">${artists_path[i-1]}</span> connects to <span style="color:red;">${artists_path[i]}</span> by <span style="color:blue;">${songs_path[i-1]}</span> <br>`;
    }

  });


}