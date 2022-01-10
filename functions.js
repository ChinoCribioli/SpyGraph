// function loadScript(url){
//   var head = document.getElementsByTagName('head')[0];
//   var script = document.createElement('script');
//   script.type = 'text/javascript';
//   script.src = url;
//   head.appendChild(script);
// }
// loadScript("API_Commands.js");

// function connect(artist1,artist2,track_id,track_popularity){
//   if(artist2 < artist1){
//     var aux = artist1;
//     artist1 = artist2;
//     artist2 = aux;
//   }
//   fetch("add-edges.php", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//         },
//         body: `artist1=${artist1}&artist2=${artist2}&trackId=${track_id}&popularity=${track_popularity}`,
//       });
//   console.log("fetch done");
// }

// function new_song(link){
//   var id = /track\/([^/^\s\?]{22})/g.exec(link);//regular expression made with RegExr
//   //in Spotify API all ID's are 22 characters long.
//   if (id == null){
//     //TODO: error message
//     return;
//   }
//   id = id[1];//I want the first capture group of the regular expression
//   const API = APIController;
//   const fill_database = async () => {
//     const token = await API.getToken();
//     const track = await API.getTrack(token,id);
//     for(var i = 0 ; i < track.artists.length ; i++){
//       for(var j = i+1 ; j < track.artists.length ; j++){
//         connect(track.artists[i].id,track.artists[j].id,track.id,track.popularity);
//       }
//     }
//     return;
//   }
//   fill_database();
//   return;
// }

function new_song(link){
  var id = /track\/([^/^\s\?]{22})/g.exec(link);//regular expression made with RegExr
  //in Spotify API all ID's are 22 characters long.
  if (id == null){
    //TODO: error message
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
  });

}

function new_playlist(link){//or album
  var isPlaylist = true; //this variable tells me if the id is from a playlist or an album
  var id = /playlist\/([^/^\s\?]{22})/g.exec(link);//regular expression made with RegExr
  //in Spotify API all ID's are 22 characters long.
  if (id == null){
    isPlaylist = false;
    id = /album\/([^/^\s\?]{22})/g.exec(link);
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
    console.log(response.json());
    return response.json();
  })
  .then(function(json) {
    console.log(json);
  });

}

function query(artist1, artist2){
  var id1 = /artist\/([^/^\s\?]{22})/g.exec(artist1), id2 = /artist\/([^/^\s\?]{22})/g.exec(artist2);
  if(id1 == null || id2 == null){
    //TODO: error message
    return;
  }
  id1 = id1[1];
  id2 = id2[1];
  if(id2 < id1){
    var aux = id1;
    id1 = id2;
    id2 = aux;
  }
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
    console.log(json);
  });


}