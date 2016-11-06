var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource: ');
});
router.get('/:sth', function(req, res, next) {
    var sth=req.params.sth;
  res.send('about time...'+sth);
  //res.render('request.html',{GraphObject: sth});
});
module.exports = router;
