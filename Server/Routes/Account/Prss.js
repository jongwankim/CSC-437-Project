var Express = require('express');
var Tags = require('../Validator.js').Tags;
var async = require('async');
const STATUS_200 = 200;

var router = Express.Router({caseSensitive: true});

router.baseURL = '/Prss';

// endpoint returns list of person(s)
router.get('/', function(req, res) {
   var adminEmail = req.session.isAdmin() && req.query.email;
   var nonAdminEmail = req.query.email && req.session.email && ((
    req.query.email.length === req.session.email.length &&
    req.query.email.toLowerCase() === req.session.email.toLowerCase()) ||
    (req.session.email.substring(0, req.query.email.length).toLowerCase()
    === req.query.email.toLowerCase()));

   var handler = function(err, prsArr) {
      res.json(prsArr);
      req.cnn.release();
   };

   if (adminEmail) {
      req.cnn.chkQry('select id, email from Person where email = ?', 
       [req.query.email], handler);
   }
   else if (req.session.isAdmin()) {
      req.cnn.chkQry('select id, email from Person', handler);
   }
   else if (nonAdminEmail || (req.session.email && !req.query.email)) {
      req.cnn.chkQry('select id, email from Person where email = ?', 
       [req.session.email], handler);
   }
   else {
      res.json([]);
      req.cnn.release();
   }
});

// endpoint adds a new person
router.post('/', function(req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var admin = req.session && req.session.isAdmin();
   var cnn = req.cnn;

   if (admin && !body.password)
      body.password = "*"; // Blocking password

   body.whenRegistered = new Date();

   async.waterfall([
   function(cb) { // Check properties and search for Email duplicates
      if (vld.hasFields(body, ["email", "password", "role", "lastName"], cb)
       && vld.chain(body.role === 0 || admin, Tags.noPermission)
       .chain(body.termsAccepted || admin, Tags.noTerms)
       .check(body.role >= 0, Tags.badValue, ["role"], cb)) {
         cnn.chkQry('select * from Person where email = ?', body.email, cb)
      }
   },
   function(existingPrss, fields, cb) { // If no duplicates, insert new Person
      if (vld.check(!existingPrss.length, Tags.dupEmail, null, cb)) {
         body.termsAccepted = (body.termsAccepted && new Date()) || 
          (admin && null);
         cnn.chkQry('insert into Person set ?', body, cb);
      }
   },
   function(result, fields, cb) { // Return location of inserted Person
      res.location(router.baseURL + '/' + result.insertId).end();
      cb();
   }],
   function(err) {
      cnn.release();
   });
});

// endpoint returns array with one element for Person {prsId}
router.get('/:id', function(req, res) {
   var vld = req.validator;
   var admin = req.session && req.session.isAdmin();

   async.waterfall([
   function(cb) {
      if (vld.checkPrsOK(req.params.id, cb)) {
         req.cnn.chkQry('select * from Person where id = ?', 
          req.params.id, cb);
      }
   },
   function(prsArr, fields, cb) {
      if (vld.check(prsArr.length, Tags.notFound, null, cb)) {
         prsArr[0].whenRegistered = prsArr[0].whenRegistered.getTime();
         if (!admin) {
            prsArr[0].termsAccepted = prsArr[0].termsAccepted.getTime();
         } else {
            delete prsArr[0].termsAccepted;
         }
         delete prsArr[0].password;
         res.json(prsArr);
         cb();
      }
   }],
   function(err) {
      req.cnn.release();
   });
});

// endpoint updates Person {prsId}
router.put('/:id', function(req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var admin = req.session && req.session.isAdmin();
   var cnn = req.cnn;
   var prsId = req.params.id;

   async.waterfall([
   function(cb) {
      if (vld.checkPrsOK(prsId, cb) &&
       vld.checkForNonSpecifiedFields(Object.getOwnPropertyNames(body))
       .chain(!(body.hasOwnProperty("email")), Tags.forbiddenField, ["email"])
       .chain(!(body.hasOwnProperty("termsAccepted")), 
       Tags.forbiddenField, ["termsAccepted"])
       .chain(!(body.hasOwnProperty("whenRegistered")), Tags.forbiddenField, 
       ["whenRegistered"])
       .chain((body.hasOwnProperty("password") && body.password) || 
       !body.hasOwnProperty("password"), Tags.badValue,["password"])
       .chain(admin || (body.hasOwnProperty("oldPassword") && 
       body.hasOwnProperty("password")) || 
       !body.hasOwnProperty("password"), Tags.noOldPwd, null)
       .check((admin && (body.role === 0 || body.role === 1)) || 
       !req.body.role, Tags.badValue, ["role"], cb)) {
         cnn.chkQry('select * from Person where id = ?', [prsId], cb);
      }
   },
   function(result, fields, cb) { 
      if (vld.check(result.length, Tags.notFound, null, cb) &&
       vld.check(body.oldPassword === result[0].password || admin || 
       !body.password, Tags.oldPwdMismatch, null, cb)) { 
         if (!(body.constructor === Object && 
          Object.keys(body).length === 0)) {
            delete body.oldPassword;
            cnn.chkQry('update Person set ? where id = ?', 
             [body, parseInt(prsId)], cb);
         } 
         else {
            cb(null, null, null);
         }
      }
   },
   function(result, fields, cb) {
      res.end();
      cb();
   }],

   function(err) {
      cnn.release();
   });
});

// endpoint deletes Person {prsId}
router.delete('/:id', function(req, res) {
   var vld = req.validator;

   async.waterfall([
      function(cb) {
         if (vld.checkAdmin(cb)) {
            req.cnn.query('DELETE from Person where id = ?', 
             [req.params.id], cb)
         }
      },
      function (result, fields, cb) {
         if (vld.check(result.affectedRows, Tags.notFound, null, cb)) {
            res.status(STATUS_200).end();
            cb();
         }
      }],
      function(err) {
         req.cnn.release();
      }
   );
});

module.exports = router;
