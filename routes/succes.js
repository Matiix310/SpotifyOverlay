const fs = require('fs');
const sourcePath = 'bd.json';
const fetch = require("node-fetch");

var express = require('express');
var router = express.Router();

/* GET succes page. */
router.get('/', function(req, res, next) {
  let code = req.query.code;
  if (!code) {
    res.redirect("./");
  } else {
    saveCode(code);
    getToken(code);
    res.render('succes', { title: 'Login Succed' });
  }
});

function saveCode(newCode) {
  var datas = JSON.parse(fs.readFileSync(sourcePath).toString());
  datas.code = newCode;
  fs.writeFileSync(sourcePath, JSON.stringify(datas));
}

function getToken(code) {
  const clientID = "0d6acec2064d43b4ae61f629155bca40";
  const clientSecret = "947b5dae047c4767911429152987e59d";
  const url = "https://accounts.spotify.com/api/token?grant_type=authorization_code&code="+code+"&redirect_uri=http%3A%2F%2Flocalhost:8000%2Fsucces"//&client_id="+clientID+"&client_secret="+clientSecret;
  
  fetch(url, {
    method: "POST",
    headers: {
      'Authorization': 'Basic MGQ2YWNlYzIwNjRkNDNiNGFlNjFmNjI5MTU1YmNhNDA6OTQ3YjVkYWUwNDdjNDc2NzkxMTQyOTE1Mjk4N2U1OWQ=',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then( response => response.json() )
  .then( json => storeToken(json) )
  .catch( err => console.log(err) );
}

function storeToken(json) {
  var datas = JSON.parse(fs.readFileSync(sourcePath).toString());
  datas.token = json.access_token;
  datas.refresh = json.refresh_token;
  fs.writeFileSync(sourcePath, JSON.stringify(datas));
}

module.exports = router;
