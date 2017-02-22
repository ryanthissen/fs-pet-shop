'use strict';

let express = require('express');
let fs = require('fs');
let path = require('path');

let app = express();
let port = 8080;

let petsPath = path.join(__dirname, 'pets.json');

app.disable('x-powered-by');

app.get('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    var pets = JSON.parse(petsJSON);

    res.send(pets);
  })
});

app.get('/pets/:id', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    var id = Number.parseInt(req.params.id);
    var pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      res.sendStatus(404);
    } else {
    res.set('Content-Type', 'match/json');
    res.send(pets[id]);
    }
  });
});

app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function(){
  console.log('listening on port 8080');
});

module.exports = app;
