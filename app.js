var http = require('http');
var fs = require('fs');
var toLowerCase = require('to-lower-case');
var url = require('url');
//var formidable = require('formidable');

http.createServer(function (req, res) {
  //console.log(req);
  var direc = url.parse(req.url,true);
  
  //esto para los nuevos nodos
  if(direc.pathname == '/nuevo_nodo'){
    fs.readFile('nuevo_nodo.html', function (err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      return res.end(data);
    });
  }
  if(direc.pathname == '/nuevoNodo/update'){
    fs.appendFile('./base de datos/nodos.txt',direc.query.artista.toLowerCase().split(' ') + ' ' + direc.query.pais.toLowerCase().split(' ') + '\n',function (err) {
      if (err) throw err;
      console.log('Saved ' + direc.query.artista + '!');
    });
    res.writeHead(200,{'Content-Type': 'text/html'});
    return res.end(direc.query.artista + ' guardado!');;
  }

  //esto para las nuevas aristas
  if(direc.pathname == '/nueva_arista'){
    fs.readFile('nueva_arista.html', function (err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      return res.end(data);
    });
  }
  if(direc.pathname == '/nuevaArista/update'){
    fs.appendFile('./base de datos/aristas.txt',direc.query.nodo_1.toLowerCase().split(' ') + ' ' + direc.query.nodo_2.toLowerCase().split(' ') + ' ' + direc.query.cancion.toLowerCase().split(' ') + '\n',function (err) {
      if (err) throw err;
      console.log('Saved ' + direc.query.cancion + '!');
    });
    res.writeHead(200,{'Content-Type': 'text/html'});
    return res.end(direc.query.cancion + ' guardado!');;
  }

  //esto sino
  fs.readFile('Prueba.html', function (err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
  });



}).listen(8080);
