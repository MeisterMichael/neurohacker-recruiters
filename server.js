// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const jwt    = require('jsonwebtoken');
const User   = require('./server/models/user');
const morgan      = require('morgan');

// Get our API routes

const app = express();
const api = require('./server/routes/api');

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

if( process.env.NODE_ENV != 'development' ) {
	app.set('forceSSLOptions', {
		enable301Redirects: true,
		trustXFPHeader: false,
		httpsPort: 443,
		sslRequiredMessage: 'SSL Required.'
	});
}


/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
