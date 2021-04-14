"use strict";

var fs = require('fs');

module.exports = {
  addPlayerPage: function addPlayerPage(req, res) {
    res.render('add-player.ejs', {
      title: "Welcome to Socka | Add a new Players",
      message: ''
    });
  },
  addPlayer: function addPlayer(req, res) {
    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    }

    var message = "";
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var position = req.body.position;
    var number = req.body.number;
    var username = req.body.username;
    var uploadedFile = req.files.image;
    var image_name = uploadedFile.name;
    var fileExtension = uploadedFile.mimetype.split('/')[1];
    image_name = username + '.' + fileExtension;
    var usernameQuery = "SELECT * FROM players WHERE user_name = '" + username + "'";
    db.query(usernameQuery, function (err, result) {
      if (err) {
        return res.status(500).send(err);
      }

      if (result.length > 0) {
        message = "Username already exists";
        res.render('add-player.ejs', {
          message: message,
          title: "Welcome to Socka | Add a new Player"
        });
      } else {
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
          uploadedFile.mv("public/assets/img/".concat(image_name), function (err) {
            if (err) {
              return res.status(500).send(err);
            }

            var query = "INSERT INTO players (first_name, last_name, position, number, image, user_name) VALUES ('" + first_name + "', '" + last_name + "', '" + position + "', '" + number + "', '" + image_name + "', '" + username + "') ";
            db.query(query, function (err, result) {
              if (err) {
                return res.status(500).send(err);
              }

              res.redirect('/');
            });
          });
        } else {
          message = "Invalid File Format. Only 'Png', 'Jpeg', and 'Gif' images are allowed. ";
          res.render('add-player.ejs', {
            message: message,
            title: "Welcome to Socka | Add a new player"
          });
        }
      }
    });
  },
  editPlayerPage: function editPlayerPage(req, res) {
    var playerId = req.params.id;
    var query = "SELECT * FROM players WHERE id = '" + playerId + "' ";
    db.query(query, function (err, result) {
      if (err) {
        return res.status(500).send(err);
      }

      res.render('edit-player.ejs', {
        title: "Edit Player",
        player: result[0],
        message: ''
      });
    });
  },
  editPlayer: function editPlayer(req, res) {
    var playerId = req.params.id;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var position = req.body.position;
    var number = req.body.number;
    var query = "UPDATE players SET first_name = '" + first_name + "', last_name = '" + last_name + "', position = '" + position + "', number = '" + number + "' WHERE players.id =  '" + playerId + "'";
    db.query(query, function (err, result) {
      if (err) {
        return res.status(500).send(err);
      }

      res.redirect('/');
    });
  },
  deletePlayer: function deletePlayer(req, res) {
    var playerId = req.params.id;
    var getImageQuery = "SELECT image FROM players WHERE id = '" + playerId + "' ";
    var deleteUserQuery = "DELETE FROM players WHERE id = '" + playerId + "' ";
    db.query(getImageQuery, function (err, result) {
      if (err) {
        return res.status(500).send(err);
      }

      var image = result[0].image;
      fs.unlink("public/assets/img/".concat(image), function (err) {
        if (err) {
          return res.status(500).send(err);
        }

        db.query(deleteUserQuery, function (err, result) {
          if (err) {
            return res.status(500).send(err);
          }

          res.redirect('/');
        });
      });
    });
  }
};