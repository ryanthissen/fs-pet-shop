'use strict';

let express = require('express');
let fs = require('fs');
let path = require('path');
var bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

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
    res.set('Content-Type', 'application/json');
    res.send(pets[id]);
    }
  });
});

app.post('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }


    var pets = JSON.parse(petsJSON);
    var age = Number(req.body.age);
    var kind = req.body.kind;
    var name = req.body.name;
    var pet = {age: age, kind: kind, name: name}

    if (!age || !kind || !name) {
      console.error(`Not the correct info provided.  Include age, kind, name.`);
      return res.sendStatus(400)
    }
    pets.push(pet);

    var petsREJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsREJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }

    res.send(pet);
    });
  });
});

app.use(function(req, res) {
  return res.sendStatus(404);
});

app.listen(port, function(){
  console.log('listening on port 8080');
});

module.exports = app;
