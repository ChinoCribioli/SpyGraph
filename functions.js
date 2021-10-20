function loadScript(url){
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  head.appendChild(script);
}
loadScript("API_Commands.js");

function new_song(link){
  var id = /track\/([^\s\?]{22})/g.exec(link);//regular expression made with RegExr
  //assuming that all ID's are 22 characters long.
  if (id == null){
    //despues ver esto
    return;
  }
  id = id[1];//I want the first capture group of the regular expression
  const API = APIController;
  const f = async () => {
    const token = await API.getToken();
    const track = await API.getTrack(token,id);

    console.log(track.name);
    return track;
  }
  f();
  return;
}