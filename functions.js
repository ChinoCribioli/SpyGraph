
function loadScript(url){
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  head.appendChild(script);
}
loadScript("API_Commands.js");

function connect(artist1,artist2,track_id,track_popularity){
  if(artist2 < artist1){
    var aux = artist1;
    artist1 = artist2;
    artist2 = aux;
  }
  fetch("add-edges.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: `artist1=${artist1}&artist2=${artist2}&trackId=${track_id}&popularity=${track_popularity}`,
      });
  console.log("fetch done");
}

function new_song(link){
  var id = /track\/([^/^\s\?]{22})/g.exec(link);//regular expression made with RegExr
  //assuming that all ID's are 22 characters long.
  if (id == null){
    //despues ver esto
    return;
  }
  id = id[1];//I want the first capture group of the regular expression
  const API = APIController;
  const fill_database = async () => {
    const token = await API.getToken();
    const track = await API.getTrack(token,id);
    for(var i = 0 ; i < track.artists.length ; i++){
      for(var j = i+1 ; j < track.artists.length ; j++){
        connect(track.artists[i].id,track.artists[j].id,track.id,track.popularity);
      }
    }
    return;
  }
  fill_database();
  return;
}