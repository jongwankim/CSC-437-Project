var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
const STATUS_200 = 200;

router.baseURL = '/Chkd';

// endpoint returns all CheckedItems
router.get('/', function(req, res) {
   var cnn = req.cnn;

   async.waterfall([
   function(cb) { 
      cnn.chkQry('select * from CheckedItem', null, cb);
   },
   function(result, fields, cb) {
      for (var i = 0; i < result.length; i++) {
         result[i].whenChecked = result[i].whenChecked.getTime() + i;
      }
      res.status(STATUS_200).json(result);
      cb();
   }],
   function(err) {
      cnn.release();
   });
});

// endpoint returns the CheckedItem indicated by {chkdId}
router.get('/:chkdId', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var id = req.params.chkdId;

   async.waterfall([
      function(cb) {
         cnn.chkQry('select * from CheckedItem where id = ?', [id], cb);
      },
      function(result, fields, cb) {
         if (vld.check(result.length, Tags.notFound, null, cb)) {
            result[0].whenChecked = result[0].whenChecked.getTime();
            res.status(STATUS_200).json(result[0]);
            cb();
         }
      }],
      function(err) {
         cnn.release();
      });
});

// endpoint deletes CheckedItem identified by {chkdId}
router.delete('/:chkdId', function(req, res) {
   var vld = req.validator;
   var chkdId = req.params.chkdId;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from CheckedItem where id = ?', [chkdId], cb);
   },
   function(chkd, fields, cb) {
      if (vld.check(chkd.length, Tags.notFound, null, cb)) {
         cnn.chkQry('delete from CheckedItem where id = ?', [chkdId], cb);
      }
   }],
   function(err) {
      if (!err)
         res.status(STATUS_200).end();
      cnn.release();
   });
});

module.exports = router;
