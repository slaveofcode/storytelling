const crypto = require("crypto");
const moment = require("moment");
const Rsvp = require("../models/Rsvp");
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

const auth = {
  auth: {
    api_key: process.env.MAILGUN_SECRET,
    domain: process.env.MAILGUN_DOMAIN
  }
};

const transporter = nodemailer.createTransport(mg(auth));

exports.index = (req, res) => {
  req.assert("name", "Nama tidak boleh kosong").notEmpty();
  req.assert("email", "Email tidak valid").isEmail();
  req.assert("email", "Email tidak boleh kosong").notEmpty();
  req.assert("message", "Ucapan tidak boleh kosong").notEmpty();
  req.sanitize("email").normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    res.json({
      response: "unsuccess",
      msg: errors
    });
  }

  new Rsvp({
    name: req.body.name,
    email: req.body.email,
    words: req.body.message
  })
    .save()
    .then(function(rsvp) {
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: "New Message Submitted",
        text: `
          New message was submitted, please check the data below!

          Let's check into http://adityameliawedding.com/rsvp/detail/${rsvp.id}

          from: ${rsvp.get("name")}
          email: ${rsvp.get("email")}
          message:

          ${rsvp.get("words")}
        `
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log("Error: " + err + process.env.MAILGUN_DOMAIN);
        } else {
          console.log("Response: " + info);
        }
      });

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

exports.list = async (req, res) => {
  let { page } = req.query;

  if (!page) page = 1;
  page = parseInt(page);

  try {
    const rsvps = await Rsvp.query(q => {
      q.orderBy("id", "desc");
    }).fetchPage({
      columns: ["id", "name", "email", "approved", "created_at"],
      pageSize: 50,
      page
    });

    res.render("rsvp_list", {
      title: "RSVP List",
      data: {
        rsvps: rsvps.toJSON(),
        next_page: page + 1,
        prev_page: page > 1 ? page - 1 : 1
      }
    });
  } catch (err) {
    res.send(err.message);
  }
};

exports.listJSON = async (req, res) => {
  let { page } = req.query;

  if (!page) page = 1;
  page = parseInt(page);

  try {
    let rsvp_list = [];
    const rsvps = await Rsvp.query(q => {
      q.where("approved", "=", true);
      q.orderBy("id", "desc");
    }).fetchPage({
      columns: ["id", "name", "email", "words", "created_at"],
      pageSize: 25,
      page
    });

    if (rsvps) {
      rsvp_list = rsvps.toJSON().map(rsvp => {
        const gravatarHash = crypto
          .createHash("md5")
          .update(rsvp.email.toLowerCase())
          .digest("hex");
        rsvp.image = `https://www.gravatar.com/avatar/${gravatarHash}?s=100&d=mm`;
        rsvp.created_at = moment(rsvp.created_at).format("ddd Do MMM, hA");
        rsvp.words = rsvp.words.replace(/\s/g, "<br/>");
        return rsvp;
      });
    }

    res.json({
      success: true,
      data: rsvp_list
    });
  } catch (err) {
    res.json({
      success: false,
      problem: err.message
    });
  }
};

exports.detail = async (req, res) => {
  let { id } = req.params;

  try {
    const rsvp = await Rsvp.query(q => {
      q.where("id", "=", id);
    }).fetch();

    res.render("rsvp_detail", {
      title: "RSVP Detail",
      data: {
        rsvp: rsvp.toJSON()
      }
    });
  } catch (err) {
    res.send(err.message);
  }
};

exports.approve = async (req, res) => {
  let { id } = req.params;

  try {
    const rsvp = await Rsvp.query(q => {
      q.where("id", "=", id);
    }).fetch();

    if (rsvp) {
      rsvp.set({ approved: true });
      await rsvp.save();

      req.flash("success", {
        msg: "RSVP's successfully approved."
      });
    } else {
      req.flash("eror", {
        msg: "RSVP's fails to approve."
      });
    }

    res.redirect(`/rsvp/detail/${id}`);
  } catch (err) {
    res.send(err.message);
  }
};

exports.reject = async (req, res) => {
  let { id } = req.params;

  try {
    const rsvp = await Rsvp.query(q => {
      q.where("id", "=", id);
    }).fetch();

    if (rsvp) {
      rsvp.set({ approved: false });
      await rsvp.save();

      req.flash("success", {
        msg: "RSVP's successfully rejected."
      });
    } else {
      req.flash("eror", {
        msg: "RSVP's fails to reject."
      });
    }

    res.redirect(`/rsvp/detail/${id}`);
  } catch (err) {
    res.send(err.message);
  }
};
