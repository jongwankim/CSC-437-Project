var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
const STATUS_200 = 200;
const MAX_MSG_LENGTH = 5000;

router.baseURL = '/Invt';

var multer = require('multer');
var storage = multer.diskStorage({
   destination: function(req, file, cb) {
      cb(null, 'ReactJSClient/public/images');
   },
   filename: function(req, file, cb) {
      cb(null, file.originalname)
   }
});
var upload = multer({storage: storage});


router.post('/Upload', upload.single('file'), (req, res) => {
   res.status(200).end();
   req.cnn.release();
});

// endpoint returns array of iventory item(s)
router.get('/', function(req, res) {
   var cnn = req.cnn;

   async.waterfall([
   function(cb) { 
      cnn.chkQry('select id, itemName, quantity from Inventory', null, cb);
   },
   function(result, fields, cb) {
      res.status(STATUS_200).json(result);
      cb();
   }],
   function(err) {
      cnn.release();
   });
});

// endpoint creates a inventory item
router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      if (vld.hasFields(body, ["itemName", "quantity"], cb)) {
         cnn.chkQry('select * from Inventory where itemName = ?', 
          [body.itemName], cb);
      }
   },
   function(existingInvt, fields, cb) {
      if (vld.checkForNonSpecifiedFieldsInvt(Object.getOwnPropertyNames(body))
       .check(!existingInvt.length, Tags.dupName, null, cb)) { 
         cnn.chkQry("insert into Inventory set ?", 
          {itemName: body.itemName, quantity: body.quantity}, cb);
      }
   },
   function(insRes, fields, cb) {
      res.location(router.baseURL + '/' + insRes.insertId).status(STATUS_200).end();
      cb();
   }],
   function() {
      cnn.release();
   });
});

// endpoint returns inventory item identified by {invtId}
router.get('/:invtId', function(req, res) {
   var cnn = req.cnn;
   var vld = req.validator;
   var id = req.params.invtId;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select id, itemName, quantity from ' +
       'Inventory where id = ?', [id], cb);
   },
   function(result, fields, cb) {
      if (vld.check(result.length, Tags.notFound, null, cb)) {
         res.status(STATUS_200).json(result[0]);
         cb();
      }
   }],
   function(err) {
      cnn.release();
   });
});

// endpoint updates the quantity of the inventory item identified by {invtId}
router.put('/:invtId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var id = parseInt(req.params.invtId);

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Inventory where id = ?', [id], cb);
   },
   function(invt, fields, cb) {
      if (vld.check(invt.length, Tags.notFound, null, cb) &&
       vld.check(body.quantity >= 0, Tags.missingField, ["quantity"], cb) &&
       vld.checkForNonSpecifiedFieldsQuantity(Object.getOwnPropertyNames(body))) { 
         cnn.chkQry("update Inventory set quantity = ? where id = ?", 
          [body.quantity, id], cb);
      }
   }],
   function(err) {
      if (!err)
         res.status(STATUS_200).end();
      req.cnn.release();
   });
});

// endpoint deletes inventory item identified by {invtId}
router.delete('/:invtId', function(req, res) {
   var vld = req.validator;
   var invtId = req.params.invtId;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {
      cnn.chkQry('select * from Inventory where id = ?', [invtId], cb);
   },
   function(invt, fields, cb) {
      if (vld.check(invt.length, Tags.notFound, null, cb)) {
         cnn.chkQry('delete from Inventory where id = ?', [invtId], cb);
      }
   }],
   function(err) {
      if (!err)
         res.status(STATUS_200).end();
      cnn.release();
   });
});

// endpoint returns all checked items correlated to inventory item identified by {invtId}
router.get('/:invtId/Chkd', function(req, res) {
   var vld = req.validator;
   var invtId = req.params.invtId;
   var cnn = req.cnn;

   async.waterfall([
   function(cb) {  // Check for existence of inventory item
      cnn.chkQry('select * from Inventory where id = ?', [invtId], cb);
   },
   function(invt, fields, cb) { // Get indicated checked items
      if (vld.check(invt.length, Tags.notFound, null, cb))
       cnn.chkQry('select * from CheckedItem where invtId = ?', invtId, cb);
   },
   function(items, fields, cb) { // Return retrieved checked items
      for (var i = 0; i < items.length; i++) {
         items[i].whenChecked = items[i].whenChecked.getTime() + i;
      }
      res.json(items).end();
      cb();
   }],
   function(err){
      cnn.release();
   });
});

// endpoint adds a checked item correlated to inventory item identified by {invtId}
router.post('/:invtId/Chkd', function(req, res){
   var vld = req.validator;
   var cnn = req.cnn;
   var invtId = req.params.invtId;
   var body = req.body;

   async.waterfall([
   function(cb) {
      if (vld.hasFields(body, ["firstName", "lastName", "email"], cb) &&
       vld.checkForNonSpecifiedFieldsCheckedItem(Object.getOwnPropertyNames(body))) {
         cnn.chkQry('select * from Inventory where id = ?', [invtId], cb);
      }
   },
   function(invt, fields, cb) {
      if (vld.check(invt.length, Tags.notFound, null, cb)) {
         cnn.chkQry('insert into CheckedItem set ?',
          {invtId: invtId, firstName: body.firstName, lastName: body.lastName,
          email: body.email, whenChecked: new Date()}, cb);
      }
   }],
   function(err) {
      if (!err)
         res.status(STATUS_200).end();
      cnn.release();
   });
});

module.exports = router;
