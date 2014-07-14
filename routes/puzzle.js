var express = require('express');
var router = express.Router();
var Datastore = require('nedb'), 
    db = new Datastore({ filename: 'puzzles.db', autoload: true });
var _ = require('underscore-node');

/* Enable CORS */
router.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
  next();
});

/* GET puzzles listing. */
router.get('/', function(req, res) {
  db.find({}, function(err, items) {
    if (err) {
      res.status(500).send('Service error');
    } else {
      items = _.map(items, function (item) {return {_id: item._id, desc: item.desc};});
      res.send(items);
    }
  });
});

/* GET puzzle. */
router.get('/:id', function(req, res) {
  var id = req.params.id;
  db.findOne({_id: id}, function(err, item) {
    if (err) {
      res.status(500).send('Service error');
    } else if (!item) {
      res.status(404).send('Not found');
    } else {
      res.send(item);
    }
  });
});

/* POST puzzle. */
router.post('/', function(req, res) {
  var puzzle = req.body;
  db.insert(puzzle, function(err, result) {
    if (err) {
      res.status(500).send('Service error');
    } else {
      res.send({success: result[0]});
    }
  });
});

/* DELETE puzzle. */
router.delete('/:id', function(req, res) {
  var id = req.params.id;
  db.remove({_id: id}, {}, function (err, numRemoved) {
    if (err) {
      res.status(500).send('Service error');
    } else if (!numRemoved) {
      res.status(404).send('Not found');
    } else {
      res.send({success: numRemoved});
    }
  });
});

module.exports = router;
