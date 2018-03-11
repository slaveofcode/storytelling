const Rsvp = require("../models/Rsvp");

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

exports.list = async (req, res) => {
  let { page } = req.query;

  if (!page) page = 1;
  page = parseInt(page);

  try {
    const rsvps = await Rsvp.query(q => {
      q.orderBy("id", "desc");
    }).fetchPage({
      columns: ["id", "name", "email", "approved", "created_at"],
      pageSize: 100,
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
