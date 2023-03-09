const http = require('http');
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("index.html","utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temprature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temprature = temprature.replace("{%tempmin%}",orgVal.main.temp_min);
    temprature = temprature.replace("{%tempmax%}",orgVal.main.temp_max);
    temprature = temprature.replace("{%location%}",orgVal.name);
    temprature = temprature.replace("{%country%}",orgVal.sys.country);
    temprature = temprature.replace("{%tempStatus%}",orgVal.weather[0].main);
    
    return temprature;
    
};

const server = http.createServer((req, res) => {
    if(req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=d24b7b2da3fa3b09c337a2cced88e3af" )
        .on('data', function (chunk) {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            // console.log(arrData[0].main.temp);
            const realTimeData = arrData.map((val) =>
                replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
        })
        .on('end', function (err) {
            if (err) return console.log('connection closed due to errors', err);
 
                console.log('end');
                res.end();
        });
    }
});

server.listen(8000, "127.0.0.1");