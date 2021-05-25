const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const fs = require('fs');
const https = require('https');
const path = require('path');
const limiter = require('./doshandle');
// Routes import
const authRoute = require('./routes/auth');
const weatherRoute = require('./routes/weather');

// Db Connection
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to db')
);

// Middlewares
app.use(express.json());

app.use((req, res, next) => {
    // Request Origin
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:${process.env.PORT_CLIENT}`);

    // Request methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, auth-token');
    
    // Cookies
    res.setHeader('Access-Control-Allow-Credentials', true); 

    next();
});

app.use(limiter);

app.use('/api/user', authRoute);
app.use('/api/weather', weatherRoute);

// Port
app.listen(process.env.PORT_API || 5000, () => console.log('Server Up and running'));

// Https
const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.crt')),
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'privatekey.key'))
}

https.createServer(httpsOptions, app)
    .listen(process.env.PORT_API_HTTPS || 5001, () => console.log('Https server Up and running'));