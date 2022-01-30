var lang = 0; //global variable that tells me the language we are using
var responses = [];

function fill_text(l){//l=0 if I want to fill in English and l=1 if I want it in Spanish
  lang = l;
  fetch("./dictionary.json")
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data){
      responses = data;
      var placeholders = ["artist1", "artist2", "new_song", "new_playlist"];
      var texts = ["artists_button", "song_button", "playlist_button", "web_player", "what", "what_explanation", "can", "can_explanation", "how", "how_explanation", "developed"];
      for(var i = 0 ; i < placeholders.length ; i++){
        document.getElementById(placeholders[i]).placeholder = data[placeholders[i]][l];
      }
      for(var i = 0 ; i < texts.length ; i++){
        document.getElementById(texts[i]).innerHTML = data[texts[i]][l];
      }
    });
}

function new_song(link){
  document.getElementById("response").innerHTML = "...";//Set the response to "wait"
  var id = /track\/([^/^\s\?]{22})/g.exec(link);//extract the id with a regular expression made with RegExr
  //in Spotify API all ID's are 22 characters long.
  if (id == null){//return error
    document.getElementById('new_song').value = "";//empty the form entry
    document.getElementById("response").innerHTML = responses["invalid_song"][lang];
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
      document.getElementById("response").innerHTML = responses["something_wrong"][lang];
      throw new Error("Something went wrong with the song");
    }
    return response.json();
  })
  .then(function(json) {
    console.log(json);
    document.getElementById('new_song').value = "";
    document.getElementById("response").innerHTML = responses["succesful_song"][lang];
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
    document.getElementById('new_playlist').value = "";
    document.getElementById("response").innerHTML = responses["invalid_playlist"][lang];;
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
      document.getElementById("response").innerHTML = responses["something_wrong"][lang];
      throw new Error("Something went wrong with the playlist");
    }
    return response.json();
  })
  .then(function(json) {
    console.log(json);
    document.getElementById('new_playlist').value = "";
    document.getElementById("response").innerHTML = responses["succesful_playlist"][lang];
  });
}

function query(artist1, artist2){
  document.getElementById("response").innerHTML = "...";
  //extract the artists' id's
  var id1 = /artist\/([^/^\s\?]{22})/g.exec(artist1), id2 = /artist\/([^/^\s\?]{22})/g.exec(artist2);
  if(id1 == null){
    document.getElementById("response").innerHTML = responses["invalid_artist1"][lang];
    return;
  }
  if(id2 == null){
    document.getElementById("response").innerHTML = responses["invalid_artist2"][lang];
    return;
  }
  id1 = id1[1];
  id2 = id2[1];
  //I want to id1 < id2
  if(id2 < id1) [id1, id2] = [id2, id1]; //a fancy way to swap the id's
  //if we have the same artist, return a special response
  if(id1 == id2){
    document.getElementById("response").innerHTML = responses["same_artist"][lang];
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
      document.getElementById("response").innerHTML = responses["something_wrong"][lang];
      throw new Error("Something went wrong with the query");
    }
    return response.json();
  })
  .then(function(json) {
    console.log(json);//this json has, json.artist_path and json.songs_path that will tell me the response
    if(json.error){ //if error is not null, these are not connected
      document.getElementById("response").innerHTML = responses["not_connected"][lang];
      return;
    }
    //else, return the artists path and songs path
    document.getElementById("response").innerHTML = responses["connected"][lang];
    var songs_path = json.songs_path, artists_path = json.artists_path;//In each list, we have the name in [0] and the id in [1]
    for(var i = 1 ; i < artists_path.length ; i++){
      document.getElementById("response").innerHTML += `<span style="color:red;"><a href="https://open.spotify.com/artist/${artists_path[i-1][1]}" target="_blank">${artists_path[i-1][0]}</a></span> ` + responses["give_path"][lang][0] + ` <span style="color:red;"><a href="https://open.spotify.com/artist/${artists_path[i][1]}" target="_blank">${artists_path[i][0]}</a></span> ` + responses["give_path"][lang][1] + ` <span style="color:blue;"><a href="https://open.spotify.com/track/${songs_path[i-1][1]}" target="_blank">${songs_path[i-1][0]}</a></span><br>`;
    }
  });
}