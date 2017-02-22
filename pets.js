"use strict";

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');
var node = path.basename(process.argv[0]);
var file = path.basename(process.argv[1]);
var cmd = process.argv[2];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }

    var pets = JSON.parse(data);

    if (process.argv[3]) {
      console.log(pets[process.argv[3]]);
    }
    else {
      console.log(pets);
    }
  });
}
else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    }
    var pets = JSON.parse(data);
    var age = Number(process.argv[3]);
    var kind = process.argv[4];
    var name = process.argv[5];
    var pet = {age: age, kind: kind, name: name}

    if (!age || !kind || !name) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }
    pets.push(pet);

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }

      console.log(pet);
    });
  });
}
else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    var pets = JSON.parse(data);
    var index = process.argv[3];
    var age = process.argv[4];
    var kind = process.argv[5];
    var name = process.argv[6];

    if (!index || !age || !kind || !name) {
      console.error(`Usage: ${node} ${file} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    pets[index].age = age;
    pets[index].kind = kind;
    pets[index].name = name;

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
    });
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`)
  process.exit(1);
}
