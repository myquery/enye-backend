const express = require("express");
const request = require("request");
const url = require("url");

//setup server instance
const app = express();

const PORT = process.env.PORT || 8000;

//default root endpoint

app.get('/', (req, res) => {
    res.send("Welcome, to access the rates endpoint use: /api/rates?base=CZK&currency=EUR,GBP,USD ")
})


//api endpoint
app.get('/api/rates', (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    let keys = Object.keys(req.query);
    if ((keys.indexOf('base') < 0) || keys.indexOf('currency') < 0) {
        return res.send({ error: 'Base and Currency parameters are required in query' });
    }
    if ((req.query['base'] === '') || (req.query['currency'] === '')) {
        return res.send({ error: 'Base and Currency require values' });
    }
    request({
        uri: "https://api.exchangeratesapi.io/latest",
        qs: queryObject

    }, function (error, response, body) {
        const json = JSON.parse(body);
        if (error) {
            console.log(error);
        }

        if (Object.keys(json).indexOf("error") >= 0) {
            return res.send(json);
        }
        let rates = {};
        for (const rate in json.rates) {
            const arr = req.query.currency.split(',');
            if (arr.indexOf(rate) >= 0) {
                console.log(arr, json.rates[rate]);
                rates[rate] = json.rates[rate];
            }
        }
        res.send({
            results: {
                base: json.base,
                date: json.date,
                rates
            }
        })
    })
})


app.listen(PORT, () => console.log('enye backend server is running...'));