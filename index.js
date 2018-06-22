require('babel-polyfill');

const express = require('express');
const path = require('path');
const port = 80;

const app = express();

app.use('/', express.static(__dirname + '/pages/index/public'));
app.get('/*', function(request, response) {
	response.sendFile(path.resolve(__dirname, 'pages/index/public', 'index.html'));
});

app.listen(port);

console.clear();
console.log('Express server started on port ' + port);
