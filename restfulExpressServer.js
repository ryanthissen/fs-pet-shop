'use strict';

var express = require('express');
var app = express();
app.disable('x-powered-by');
var port = process.env.PORT || 8080;

var fs = require('fs');
var path = require('path');

var morgan = require('morgan');
app.use(morgan('short'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var petsPath = path.join(__dirname, 'pets.json');

app.get('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if(err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    var pets = JSON.parse(data);

    res.send(pets);
  })
})

app.get('/pets/:id', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    var id = Number.parseInt(req.params.id);
    var pets = JSON.parse(data);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      res.sendStatus(404);
    } else {
      res.set('Content-Type', 'application/json');
      res.send(pets[id]);
    }
  });
});

app.patch('/pets/:id', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    var id = Number.parseInt(req.params.id);
    var pets = JSON.parse(data);
    // var pet = pets[id];
    var age = Number(req.body.age);
    var kind = req.body.kind;
    var name = req.body.name;

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      res.sendStatus(404);
    } else {
      if (age) {
        pets[id].age = age;
      } if (kind) {
        pets[id].kind = kind;
      } if (name) {
        pets[id].name = name;
      }
    }

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      res.set('Content-Type', 'application/json')
      res.send(pets[id]);
    })
  })
})

app.post('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    var pets = JSON.parse(data);
    var age = Number(req.body.age);
    var kind = req.body.kind;
    var name = req.body.name;
    var pet = {age: age, kind: kind, name: name}

    if (!age || !kind || !name) {
      console.error('Not the correct info provided.  Include valid age, kind, name');
      return res.sendStatus(400);
    } else {
      pets.push(pet)
    }

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      res.set('Content-Type', 'application/json');
      res.send(pet);
    });
  });
});

app.delete('/pets/:id', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    var pets = JSON.parse(data);
    var id = Number.parseInt(req.params.id);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404)
    } else {
      res.send(pets[id]);
      pets.splice(id, 1);
    }

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      // res.set('Content-Type', 'application/json');
      // res.send(pet);
    });
  });
});



app.listen(port, function(){
  console.log('listening on port ' + port);
});

module.exports = app;
