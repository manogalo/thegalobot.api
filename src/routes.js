if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const request = require('request');


router.get('/', function(req, res) {
    res.send('Birds home');
});

router.get('/about', function(req, res) {
    res.send('About birds');
});

router.get('/getToken', function(req, res) {

    var token = '';
    const options = {
        url: process.env.GET_TOKEN,
        json:true,
        body: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'client_credentials'
        }
    }

    request.post(options, (err, response, body) => {
        if (err) {
            return console.log(err);
        }
        //token = response.body.access_token
        process.env.ACCESS_TOKEN = response.body.access_token
        res.send(response.body.access_token);
    });
})

router.get('/getOAuth', function(req, res) {
    var token = '';
    const options = {
        url: process.env.GET_TOKEN,
        json:true,
        body: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: process.env.OAUTH_TOKEN,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost'
        }
    }

    request.post(options, (err, response, body) => {
        if (err) {
            return console.log(err);
        }

        res.send(response.body)
    });
})

router.get('/getUserId/:channel', function(req,res) {
    var rawData = '';
    const options = {
        url: `https://api.twitch.tv/helix/users?login=${req.params.channel}`,
        method: 'GET',
        headers: {
            'Client-ID': process.env.CLIENT_ID,
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
        }
    }

    request.get(options, (err, response,body) => {
        if (err) {
            return console.log(err);
        }
        rawData = JSON.parse(response.body)

        res.send(rawData.data[0].id);
    })
});

router.get('/getBlockList/:id', function(req, res) {
    const options = {
        url: `https://api.twitch.tv/helix/moderation/banned?broadcaster_id=${req.params.id}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.OAUTH_TOKEN}`,
            'Client-Id': process.env.CLIENT_ID
        }
    }

    console.log(options)

    request.get(options, function (err,response) {
        if (err) {
            return console.log(err);
        }

        rawData = JSON.parse(response.body);

        for (var user in rawData.data)
            console.log(rawData.data[user].user_login)

        res.send(rawData);
    })
})

router.get('/validateToken', function(req, res) {
    const options = {
        url: `https://id.twitch.tv/oauth2/validate`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.OAUTH_TOKEN}`
        }
    }

    request.get(options, function (err,response) {
        if (err) {
            return console.log(err);
        }

        rawData = JSON.parse(response.body);
        
        res.send(rawData);
    })
})

// 37468372

module.exports = router;