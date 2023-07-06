const port = process.env.PORT || 3000;
const express = require('express'); 
const request = require('request'); 
const cors = require('cors'); 
const app = express(); 


app.use(cors());


app.use(express.static('web'));


app.get('/list', (req, res) => { 
  
  var client_id = process.env.CLIENT_ID;
  var client_secret = process.env.CLIENT_SECRET; 

  
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true 
  };

  
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) { 

      
      var token = body.access_token;
      var options = {
        url: 'https://api.spotify.com/v1/playlists/6VSaqaoH2s3x0xMJCUeDzV/tracks', 
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


console.log(`Listening on ${port}`);
app.listen(port);
