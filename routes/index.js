var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
 
  res.render('request.ejs', { theMonsterInput: "666" });
}); 
router.get('/:sth', function(req, res, next) {

    var sth=JSON.parse(req.params.sth);
    res.render('request.ejs', { theMonsterInput: JSON.stringify(sth) });
  
  
  //res.render('request.html',{GraphObject: sth});
});
router.use(function (err, req, res, next) {
  console.error(err.stack)
  res.render('request.ejs', { theMonsterInput: "999" });
})

//assuming app is express Object.
/*
router.get('/',function(req,res){
       
     res.sendFile(path.resolve(app.get('appPath') + '/new_index.html'));
//     path.resolve(app.get('appPath') + '/index.html')

});*/

module.exports = router;
