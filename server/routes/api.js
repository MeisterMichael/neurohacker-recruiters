const express = require('express');
const csv = require('express-csv')
const router	= express.Router();
const User		= require('../models/user');
const Report	= require('../models/report');
const jwt		 = require('jsonwebtoken');
const config	= require('../../config');

/* GET api listing. */
router.get('/', (req, res) => {
	res.send('Ok');
});

router.post('/auth', (req, res) => {

	// find the user
	User.findOne({
		username: req.body.username,
		password: req.body.password
	}, function(err, user) {
		if (err) throw err;

		if (!user) {
			res.json({
				status: 500,
				mesage: 'Authentication failed. Wrong username/password.'
			});
		} else {

			// if user is found and password is right
			// create a token
			var token = jwt.sign(user, config.secret, {
				expiresIn : 60*60*24 // expires in 24 hours
			});

			// return the information including token as JSON
			res.json({
				status: 200,
				mesage: 'OK',
				response: {
					token: token,
					user: user.publicAttributes()
				}
			});

		}

	});

});




// route middleware to verify a token
router.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) {
				return res.json({
					status: 500,
					mesage: 'Failed to authenticate token'
				});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).json({
			status: 403,
			mesage: 'No token provided'
		});

	}
});



router.get('/reports', (req, res) => {

	// find the user
	Report.findAll({}, function(err, reports) {
		if (err) throw err;

		if (!reports) {
			res.json({
				status: 404,
				mesage: 'Not found.'
			});
		} else {

			reports.forEach(function(value, index){
				reports[index] = reports[index].publicAttributes()
			})

			res.send({
				status: 200,
				mesage: 'OK',
				response: {
					totalRecords: 100,
					data: reports
				}
			});
		}

	});

});

router.get('/reports/:id', (req, res) => {

	// find the user
	Report.findOne({
			id: req.params.id
	}, function(err, report) {
		if (err) throw err;

		if (!report) {
			res.json({
				status: 404,
				mesage: 'Not found.'
			});
		} else {

			res.json({
				status: 200,
				mesage: 'OK',
				response: report.publicAttributes()
			});

		}

	});
});

router.get('/reports/:id/results', (req, res) => {
	Report.findOne({
		id: req.params.id
	}, function(err, report) {
		if (err) throw err;

		if (!report) {
			res.json({
				status: 404,
				mesage: 'Not found.'
			});
		} else {

			report.results( Object.assign({}, req.query, { channelPartnerId: req.decoded.channelPartnerId, userId: req.decoded.id } ), function( err, results ) {
				if ( req.query.format == 'csv' ) {

					// @todo render as json
					res.attachment(report.title+'.csv')

					var rows = [ [] ]
					report.cols.forEach(function( col ){
						rows[0].push( col.header )
					})

					results.rows.forEach(function(resultRow){
						var row = []
						report.cols.forEach(function( col ){
							row.push( resultRow[col.field] )
						})
						rows.push(row)
					})

					res.csv(rows);

				} else {

					res.send({
						status: 200,
						mesage: 'OK',
						response: results
					});

				}

			});
		}
	});
});

module.exports = router;
