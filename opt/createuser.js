var fs = require('fs');
var csv = require('csv');
const bcrypt = require("bcrypt");

const db = require("../models");
const User = db.User;
const Op = db.Sequelize.Op;
const path = require('path');


var input = fs.createReadStream(path.join(__dirname, "users.csv"));
//var input = fs.createReadStream('/opt/users.csv');
var parser = csv.parse({
    delimiter: ',',
    columns: true
})

var transform =  csv.transform(async function(row) {
    var resultObj = {
        first_name: row['first_name'],
        last_name: row['last_name'],
        username: row['email'],
        password: await bcrypt.hash(row['password'], 10)   
    }
    User.create(resultObj)
        .then(function() {
            console.log('Record created')
        })
        .catch(function(err) {
            console.log('Error encountered: ' + err)
        })
})

input.pipe(parser).pipe(transform)