var Express = require('express');
var Tags = require('../Validator.js').Tags;
var ssnUtil = require('../Session.js');
var router = Express.Router({caseSensitive: true});
const STATUS_200 = 200;

router.baseURL = '/Ssns';

// endpoint returns all active sessions
router.get('/', function(req, res) {
   var body = [], ssn;

   if (req.validator.checkAdmin()) {
      for (var cookie in ssnUtil.sessions) {
         ssn = ssnUtil.sessions[cookie];
         body.push({cookie: cookie, prsId: ssn.id, loginTime: ssn.loginTime});
      }
      res.status(STATUS_200).json(body);
   }
   req.cnn.release();
});

// endpoint generates a browser-session cookie
router.post('/', function(req, res) {
   var cookie;
   var cnn = req.cnn;

   cnn.query('select * from Person where email = ?', [req.body.email],
    function(err, result) {
      if (req.validator.check(result.length && result[0].password ===
       req.body.password, Tags.badLogin)) {
         cookie = ssnUtil.makeSession(result[0], res);
         res.location(router.baseURL + '/' + cookie).status(STATUS_200).end();
      }
      cnn.release();
   });
});

// endpoint returns the indicated session {cookie}
router.delete('/:cookie', function(req, res) {
   var cookie = req.params.cookie;
   var cookies = req.cookies;
   var vld = req.validator;
   var admin = req.session && req.session.isAdmin();

   if (vld.check(ssnUtil.sessions[cookie], Tags.notFound, null) && (admin ||
    vld.check(cookie === cookies[ssnUtil.cookieName], Tags.noPermission))) {
      ssnUtil.deleteSession(req.params.cookie);
      res.status(200).end();
   }
   req.cnn.release();
});

// endpoint deletes the indicated session {cookie}
router.get('/:cookie', function(req, res) {
   var cookie = req.params.cookie;
   var vld = req.validator;

   if (vld.check(ssnUtil.sessions[cookie], Tags.notFound, null) && 
    vld.checkPrsOK(ssnUtil.sessions[cookie].id)) {
      res.json({cookie: cookie, prsId: ssnUtil.sessions[cookie].id,
       loginTime: ssnUtil.sessions[cookie].loginTime});
   }
   req.cnn.release();
});

module.exports = router;
