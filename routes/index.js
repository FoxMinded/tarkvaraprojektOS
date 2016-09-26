var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('new_index.html', { title: 'ejs' });
}); 
//assuming app is express Object.
/*
router.get('/',function(req,res){
       
     res.sendFile(path.resolve(app.get('appPath') + '/new_index.html'));
//     path.resolve(app.get('appPath') + '/index.html')

});*/
module.exports = router;
