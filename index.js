const express = require('express');
const router = express.Router();
const request = require('request');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js')

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));

const apiKey = 'rdj8EhovE8awpiGjlak6TgGehAQ6HThNoo8QUTSXnQN' // const apiKey = 'paste key here'
const apiSecret = '7gpokZK0zD4gpTkkhIIom5wu0ML2yqXnDZoHrHnoQTw' // const apiSecret = 'paste secret here'

const apiPath = 'v2/auth/r/orders/'

const nonce = (Date.now() * 1000).toString() 

const body = {
    limit: 10
    
} 

let signature = `/api/${apiPath}${nonce}${JSON.stringify(body)}` 

const sig = CryptoJS.HmacSHA384(signature, apiSecret).toString() 


app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get('/trades', (req,res) =>{

    const pathParams = 'trades/tBTCUSD/hist' // Change these based on preferred pairs
const queryParams = 'limit=120&sort=-1' 

    var options = {
        url: "https://api-pub.bitfinex.com/v2/" + pathParams +'?'+ queryParams,
        method: "GET"
    }

    request(options, function (error, response, body) {

        if (error) {
            console.log("ERROR");
        }else {
            console.log("SUCCESS");
            var dataset = JSON.parse(body);
        console.log(dataset);
        }
    })

})
    
    
app.post("/", (req, res) => {

    var sym = req.body.Symbol;
    var apiAdd = apiPath + sym + '/hist';

    var options = {
        url: "https://api.bitfinex.com/" + apiAdd,
        method: "POST",
        body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
            'bfx-nonce': nonce,
            'bfx-apikey': apiKey,
            'bfx-signature': sig
          }
    };

    request(options, function (error, response, body) {

        if (error) {
            console.log("ERROR");
        } else {

            var data = JSON.parse(body);
            console.log(data);
            
        }

    })
});


app.listen(4000, function () {
    console.log("Server is Running on Port 4000");
  });