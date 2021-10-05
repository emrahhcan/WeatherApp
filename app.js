const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const { APP_KEY } = require('./config.js');

const port = process.env.PORT || 3000;

const app = express();

let weather = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    let date = new Date();
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    let day = date.toLocaleDateString('en-US', options);

    res.render('weather', {
        currentDate: day,
        weatherList: weather
    });

});

app.post('/', (req, res) => {
    const query = req.body.cityName;
    const apiKey = APP_KEY;
    const unit = 'metric';
    const apiURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + apiKey + '&units=' + unit;

    https.get(apiURL, (response) => {
        response.on('data', (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const city = weatherData.name;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            const weatherProperties = {
                city: city,
                temp: temp,
                description: description,
                icon: imgURL
            };
            
            weather.push(weatherProperties);
            res.redirect('/');
        });
    });

});

app.listen(port, () => {
    console.log('Weather app is running on port 3000');
});