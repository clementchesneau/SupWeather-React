const router = require('express').Router();
const verify = require('./verifyToken');
const request = require('request');
const City = require('../model/City');
const {addCityValidation} = require('../validation');

router.get('/', verify, (req, res) => {
    City.find({userId: req.user._id}, 'city cityId -_id', (error, data) => {
        if (error) return res.send(error);

        let cities = []

        if (data.length == 0) return res.send("no cities");

        data.forEach(element => {
            request(`https://api.openweathermap.org/data/2.5/weather?q=${element.city}&appid=${process.env.API_ID}&units=metric`,
            (error, response, body) => {

                if (error) return res.status(400).send(error); 

                const jsonBody = JSON.parse(body);
                const city = {
                    id: element.cityId,
                    name: element.city,
                    state: jsonBody.weather[0].main,
                    description: jsonBody.weather[0].description,
                    temp: Math.round(jsonBody.main.temp),
                    feels_like: Math.round(jsonBody.main.feels_like),
                    temp_min: Math.round(jsonBody.main.temp_min),
                    temp_max: Math.round(jsonBody.main.temp_max),
                    icon: jsonBody.weather[0].icon
                }

                
                // addcity
                cities.push(city);
                if (cities.length == data.length) {
                    res.send(cities);
                }
            });
        });
    });
});

router.post('/city', verify, (req, res) => {
    // Validate user data
    const { error } = addCityValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Test api response to city
    request(`https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${process.env.API_ID}&units=metric`, 
    async (error, response, body) => {

        const data = JSON.parse(body);

        if (data.cod && data.cod === "404") return res.status(400).send(data.message);
        if (error) return res.status(400).send(error);

        // Check if city is already registered
        const cityExist = await City.findOne({cityId: data.id, userId: req.user._id});
        if (cityExist) return res.status(400).send('This city already exist for this user!');

        // Create city
        const city = new City({
            city: req.body.city,
            cityId: data.id,
            userId: req.user._id,
            lat: data.coord.lat,
            lon: data.coord.lon
        });
        try {
            const savedCity = await city.save();
            const cityToReturn = {
                id: data.id,
                name: req.body.city,
                state: data.weather[0].main,
                description: data.weather[0].description,
                temp: Math.round(data.main.temp),
                feels_like: Math.round(data.main.feels_like),
                temp_min: Math.round(data.main.temp_min),
                temp_max: Math.round(data.main.temp_max),
                icon: data.weather[0].icon
            }

            res.send(cityToReturn);
        }
        catch(error) {
            res.status(400).send(error);
        }
    });
});

router.get('/city/:id', verify, async (req, res) => { 
    // Check if city exist
    const city = await City.findOne({cityId: req.params.id, userId: req.user._id});
    if (!city) return res.send('This city doesn\'t exist');

    request(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&exclude=minutely,hourly,alerts,current&appid=${process.env.API_ID}&units=metric`, 
    async (error, response, body) => {

        if (error) return res.status(400).send(error); 

        const data = JSON.parse(body);
        let days = [];
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        for(let i = 0; i < 7; i++) {
            let date = new Date(data.daily[i].dt * 1000);
            days.push({
                date: day[date.getDay()] + " " + date.toLocaleString("en-US", {day: "numeric"}) + " " + month[date.getMonth()],
                state: data.daily[i].weather[0].main,
                description: data.daily[i].weather[0].description,
                day_temp: Math.round(data.daily[i].temp.day),
                day_feels_like: Math.round(data.daily[i].feels_like.day),
                temp_min: Math.round(data.daily[i].temp.min),
                temp_max: Math.round(data.daily[i].temp.max),
                sunrise:  new Date(data.daily[i].sunrise * 1000).toLocaleString("en-US", {hour: "numeric", minute: "numeric"}),
                sunset: new Date(data.daily[i].sunset * 1000).toLocaleString("en-US", {hour: "numeric", minute: "numeric"}),
                humidity: data.daily[i].humidity,
                wind: Math.round(data.daily[i].wind_speed * 3.6),
                icon: data.daily[i].weather[0].icon,
                clouds: data.daily[i].clouds,
                rain: Math.round(data.daily[i].pop * 100)
            });

            if (i == 6) {
                const cityInfo = {
                    name: city.city,
                    days: days
                };

                res.send(cityInfo);
            }
        }
    });
});

router.delete('/city/:id', verify, async (req, res) => { 
    // Check if city is already registered
    const city = await City.findOne({cityId: req.params.id, userId: req.user._id});
    if (!city) return res.send('This city doesn\'t exist');

    // Delete city
    try {
        await City.deleteOne(city);
        res.send("City deleted!");
    }
    catch(error) {
        res.status(400).send(error);
    }
});

module.exports = router;