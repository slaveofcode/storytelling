const Rsvp = require("../models/Rsvp");
const nodemailer = require("nodemailer");

/**
 * GET /
 */
exports.index = function(req, res) {
  res.render("home", {
    title: "Amelia & Aditya Wedding"
  });
};

exports.rsvp = (req, res) => {
  req.assert("name", "Nama tidak boleh kosong").notEmpty();
  req.assert("email", "Email tidak valid").isEmail();
  req.assert("email", "Email tidak boleh kosong").notEmpty();
  req.assert("message", "Ucapan tidak boleh kosong").notEmpty();
  req.sanitize("email").normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash("error", errors);
    return res.redirect("/");
  }

  new Rsvp({
    name: req.body.name,
    email: req.body.email,
    words: req.body.message
  })
    .save()
    .then(function(user) {
      res.json({
        response: "success"
      });
    })
    .catch(function(err) {
      res.json({
        response: "unsuccess"
      });
    });
};
