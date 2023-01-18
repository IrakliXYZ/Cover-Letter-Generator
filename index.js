const express = require('express');
const bodyParser = require('body-parser');
const generate = require('./api/generate');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/generate', generate);

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});