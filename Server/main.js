var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Session = require('./Routes/Session.js');
var Validator = require('./Routes/Validator.js');
var CnnPool = require('./Routes/CnnPool.js');
var async = require('async');
var app = express();

const STATUS_200 = 200;
const STATUS_400 = 400;
const STATUS_401 = 401;
const STATUS_404 = 404;
const STATUS_500 = 500;
const PORT_INDEX = 3;

// Static paths to be served like index.html and all client side js
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
   console.log("Handling " + req.path + '/' + req.method);
   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
   res.header("Access-Control-Allow-Credentials", "true");
   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, " +
    "DELETE, OPTIONS");
   res.header("Access-Control-Expose-Headers", "Location");
   res.header("Access-Control-Allow-Headers", "Content-Type");

   next();
});

// No further processing needed for options calls.
app.options("/*", function(req, res) {
   res.status(STATUS_200).end();
});

// Static path to index.html and all clientside js
// Parse all request bodies using JSON
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

// Attach cookies to req as req.cookies.<cookieName>
app.use(cookieParser());

// Set up Session on req if available
app.use(Session.router);

// Check general login.  
// If OK, add Validator to |req| and continue processing,
// otherwise respond immediately with 401 and noLogin error tag.
app.use(function(req, res, next) {
   console.log(req.path);
   if (req.session || (req.method === 'POST' &&
    (req.path === '/Prss' || req.path === '/Ssns'))) {
      req.validator = new Validator(req, res);
      next();
   } else
      res.status(STATUS_401).end();
});

// Add DB connection, with smart chkQry method, to |req|
app.use(CnnPool.router);

// Load all subroutes
app.use('/Prss', require('./Routes/Account/Prss.js'));
app.use('/Ssns', require('./Routes/Account/Ssns.js'));
app.use('/Invt', require('./Routes/Inventory/Invt.js'));
app.use('/Chkd', require('./Routes/Inventory/Chkd.js'));

// Special debugging route for /DB DELETE.  Clears all table contents,
//resets all auto_increment keys to start at 1, and reinserts one admin user.
app.delete('/DB', function(req, res) {
   // Callbacks to clear tables
   
   if (req.validator.checkAdmin()) {
      var cbs = ["Inventory", "CheckedItem", "Person"].map(function(tblName) {
         return function(cb) {
            req.cnn.query("delete from " + tblName, cb);
         };
      });

      // Callbacks to reset increment bases
      cbs = cbs.concat(["Inventory", "CheckedItem", "Person"]
         .map(function(tblName) {
         return function(cb) {
            req.cnn.query("alter table " + tblName + 
             " auto_increment = 1", cb);
         };
      }));

      // Callback to reinsert admin user
      cbs.push(function(cb) {
         req.cnn.query('INSERT INTO Person (firstName, lastName, email,' +
          ' password, whenRegistered, role) VALUES ' +
          '("Joe", "Admin", "adm@11.com","password", NOW(), 1);', cb);
      });

      // Callback to clear sessions, release connection and return result
      cbs.push(function(callback) {
         for (var session in Session.sessions)
            delete Session.sessions[session];
         callback();
      });

      async.series(cbs, function(err) {
         req.cnn.release();
         if (err)
            res.status(STATUS_400).json(err);
         else
            res.status(STATUS_200).end();
      });
   }
   else {
      req.cnn.release();
   }
});

// Handler of last resort.  
// Print a stacktrace to console and send a 500 response.
app.use(function(req, res) {
   res.status(STATUS_404).end();
   res.cnn.release();
});

app.use(function(err, req, res, next) {
   res.status(STATUS_500).json("error: " + err.stack);
   req.cnn && req.cnn.release();
});

var port;

if (process.argv.length > 2) {
   if (process.argv[2] === "-p") {
      port = process.argv[PORT_INDEX];
   }
}

app.listen(port, function() {
   console.log('App Listening on port ' + port);
});
