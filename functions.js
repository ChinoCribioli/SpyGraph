function fill_text(l){//l=0 if I want to fill in English and l=1 if I want it in Spanish
  fetch("./dictionary.json")
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data){
      console.log(data);
      var placeholders = ["artist1", "artist2", "new_song", "new_playlist"];
      var texts = ["artists_button", "song_button", "playlist_button", "web_player", "what", "what_explanation", "can", "can_explanation", "how", "how_explanation", "developed"];
      for(var i = 0 ; i < placeholders.length ; i++){
        document.getElementById(placeholders[i]).placeholder = data[placeholders[i]][l];
      }
      for(var i = 0 ; i < texts.length ; i++){
        document.getElementById(texts[i]).innerHTML = data[texts[i]][l];
      }
      
      // document.getElementById("artist1").placeholder = data.artist1[l];
      // document.getElementById("artist2").placeholder = data.artist2[l];
      // document.getElementById("artists_button").innerHTML = data.artists_button[l];
      // document.getElementById("new_song").placeholder = data.new_song[l];
      // document.getElementById("song_button").innerHTML = data.song_button[l];
      // document.getElementById("new_playlist").placeholder = data.new_playlist[l];
      // document.getElementById("playlist_button").innerHTML = data.playlist_button[l];
      // document.getElementById("web_player").innerHTML = data.web_player[l];
      // document.getElementById("what").innerHTML = data.what[l];
      // document.getElementById("can").innerHTML = data.can[l];
      // document.getElementById("how").innerHTML = data.how[l];
      // document.getElementById("what_explanation").innerHTML = data.what_explanation[l];
      // document.getElementById("can_explanation").innerHTML = data.can_explanation[l];
      // document.getElementById("how_explanation").innerHTML = data.how_explanation[l];
      // document.getElementById("developed").innerHTML = data.developed[l];
    });
}

function new_song(link){
  document.getElementById("response").innerHTML = "...";//Set the response to "wait"
  var id = /track\/([^/^\s\?]{22})/g.exec(link);//extract the id with a regular expression made with RegExr
  //in Spotify API all ID's are 22 characters long.
  if (id == null){//return error
    document.getElementById('song').value = "";//empty the form entry
    document.getElementById("response").innerHTML = "Invalid song :(";
    return;
  }
  id = id[1];//I want the first capture group of the regular expression
  fetch("add-song.php", {//call the PHP file with the value of the id of the song
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `trackId=${id}`,
  }).then(function(response) {
    if (!response.ok) {
      console.log("HTTP error, status = " + response.status);
      document.getElementById("response").innerHTML = "Something went wrong, please try again later :(";
      throw new Error("Something went wrong with the song");
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
  
  if (id == null){//if it didn't find a successful id, it means that it's an album instead of a playlist
    isPlaylist = false;
    id = /album\/([^/^\s\?]{22})/g.exec(link);
  }
  if(id == null){//if it didn't find anything again, return an error
    document.getElementById('playlist').value = "";
    document.getElementById("response").innerHTML = "Invalid playlist or album :(";
    return;
  }
  id = id[1];//I want the first capture group of the regular expression
  fetch("add-playlist.php", {//call the PHP file with the playlist/album id and what it is
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `playlistId=${id}&isPlaylist=${isPlaylist}`,
  }).then(function(response) {
    if (!response.ok) {
      console.log("HTTP error, status = " + response.status);
      document.getElementById("response").innerHTML = "Something went wrong, please try again later :(";
      throw new Error("Something went wrong with the playlist");
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
  //extract the artists' id's
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
  //I want to id1 < id2
  if(id2 < id1) [id1, id2] = [id2, id1]; //a fancy way to swap the id's
  //if we have the same artist, return a special response
  if(id1 == id2){
    document.getElementById("response").innerHTML = "They are connected since they are the same artists.";
    return;
  }
  fetch("query.php", {//call the PHP file with the artists' id's
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `artist1=${id1}&artist2=${id2}`,
  }).then(function(response) {
    if (!response.ok) {
      console.log("HTTP error, status = " + response.status);
      document.getElementById("response").innerHTML = "Something went wrong, please try again later :(";
      throw new Error("Something went wrong with the query");
    }
    return response.json();
  })
  .then(function(json) {
    console.log(json);//this json has, json.artist_path and json.songs_path that will tell me the response
    if(json.error){ //if error is not null, these are not connected
      document.getElementById("response").innerHTML = "These artists are not connected for now :( <br>But you can upload more songs or playlists and see if you can connect them!";
      return;
    }
    //else, return the artists path and songs path
    document.getElementById("response").innerHTML = "We found a path!<br>";
    var songs_path = json.songs_path, artists_path = json.artists_path;
    for(var i = 1 ; i < artists_path.length ; i++){
      document.getElementById("response").innerHTML += `<span style="color:red;">${artists_path[i-1]}</span> connects to <span style="color:red;">${artists_path[i]}</span> by <span style="color:blue;">${songs_path[i-1]}</span> <br>`;
    }
  });
}