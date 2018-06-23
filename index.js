require('babel-polyfill');

const express = require('express');
const path = require('path');
const port = 8080;

const app = express();

const registerApi = require('./api/api');
registerApi(app);

app.use('/', express.static(__dirname + '/pages/index/public'));
app.get('/*', function(request, response) {
	response.sendFile(path.resolve(__dirname, 'pages/index/public', 'index.html'));
});

app.listen(port);

console.log('Express server started on port ' + port);
