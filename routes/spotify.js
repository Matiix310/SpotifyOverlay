const fs = require('fs');
const sourcePath = 'bd.json';

var express = require('express');
var router = express.Router();

/* GET overlay page. */
router.get('/', function(req, res) {
    var datas = JSON.parse(fs.readFileSync(sourcePath).toString());
    if (req.query.token) {
        datas.token = req.query.token;
        fs.writeFileSync(sourcePath, JSON.stringify(datas));
        res.redirect("./spotify");
    }
    datas = JSON.parse(fs.readFileSync(sourcePath).toString());
    var token = datas.token;
    var refresh = datas.refresh;
    res.render('spotify', { token: token, refresh: refresh});
});

module.exports = router;
