var crypto = require("crypto");
var bcrypt = require("bcrypt-nodejs");
var bookshelf = require("../config/bookshelf");

var Rsvp = bookshelf.Model.extend({
  tableName: "rsvps",
  hasTimestamps: true
});

module.exports = Rsvp;
