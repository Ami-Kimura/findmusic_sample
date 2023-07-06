require('dotenv').config();
const express = require('express'); // expressモジュールを読み込む
const request = require('request'); // requestモジュールを読み込む
const cors = require('cors'); // corsモジュールを読み込む
const app = express(); // expressアプリを生成する

// CORSの設定
app.use(cors());

// webフォルダの中身を公開する
app.use(express.static('web'));

// API
app.get('/list', (req, res) => { // /listというものが含まれているときに行う反応
  
  var client_id = process.env.CLIENT_ID;
  var client_secret = process.env.CLIENT_SECRET; 

  //認証を行う
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true //基本固定
  };

  //取りたい情報は何か、目的のための命令
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) { //こういう書き方をする

      //アクセストークンを使ってAPIを使いデータを取ってくる
      var token = body.access_token;
      var options = {
        // url: 'https://api.spotify.com/v1/playlists/37i9dQZEVXbKXQ4mDTEBXq/tracks', //japan top50
        url: 'https://api.spotify.com/v1/playlists/6VSaqaoH2s3x0xMJCUeDzV/tracks', //myplaylist blue artwork
        // url: 'https://api.spotify.com/v1/playlists/4BSj7IwrHLRpZeVNodMh5Z/tracks',    //coachella 2023
        headers: { 'Authorization': 'Bearer ' + token,
         },
        json: true
      };

      request.get(options, function (error, response, body) {
        res.json(body);
      });
    }
  });
});

//3000というポート番号（サーバー）に表示させる
console.log('Listening on 3000');
app.listen(3000);
