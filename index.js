const express = require("express");
const request = require("request");
const url = require("url");

const app = express();

app.get('/api/rates', (req, res)=>{
    const queryObject = url.parse(req.url,true).query;
    request({
        uri: "https://api.exchangeratesapi.io/latest",
        qs:queryObject
        
    }, function(error, response, body){
        const json = JSON.parse(body);
        if(error){
            console.log(error);
        }
        res.send({
            results:{
                base:json.base,
                date: json.date,
                rates:{
                    EUR: json.rates.EUR,
                    GBP: json.rates.GBP,
                    USD: json.rates.USD
                }
            }

        })
    })
})


app.listen(8000, () => console.log('enye backend server is running...'));