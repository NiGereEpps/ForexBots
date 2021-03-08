var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var Twit = require('twit')

var T = new Twit({
    consumer_key: "ge6YZePfpvReCuzRwzudpnFg4",
    consumer_secret: "V6oAF68PLtZBrPy16SaIaEEJrnMBdbV5EwH5PWA4ohoT1s1r9Q",
    access_token: "1122540217767026688-6rZgLbZyTdl8RlOdJThA0eDDLukOmV",
    access_token_secret: "Swos25jVZFv3vU1rzQbLl1Qcm8A6CY8nfyO6vzAgTEbFQ"
})

let port = process.env.PORT;

if (port == null || port == "") {
  port = 3003;
}

app.use(express.static(__dirname + '/public'))
app.engine('html', require('hogan-express'))
app.set('view engine', 'html')

app.get('/', function(req, res) {
    res.render('index', { title: 'NE Forex Bots' })
})

app.listen(port, function() {
    console.log("listening on port: " + port)
})

app.use(bodyParser.json())

app.post('/cloud', function(req, res) {
    const word = req.body.word
    theTweets = []

    function getTweets(word) {
        return new Promise((resolve, reject) => {
            console.log('Getting Tweets for ', word)

            var params = {
                q: word + ' since:2021-01-01',
                count: 50,
                lang: 'en'
            }

            T.get('search/tweets', params, gotData)

            function gotData(err, data, response) {
                var tweets = data.statuses;
                sw = require('stopword')
                const custom = sw.en.concat(['RT', '@', 'http', '', ' ', '\n', '-', '|', '.', ':', '...'])

                for (var i = 0; i < tweets.length; i++) {
                    let old = tweets[i].text.split(' ')
                    const cleanText = sw.removeStopwords(old, custom)
                    theTweets.push(cleanText.join(' '))
                }

            }

            setTimeout(() => {
                resolve();;
            }, 1000);
        });

    }

    async function sendData() {
        await getTweets(word)
        res.json({ output: theTweets })
    }

    sendData()

})