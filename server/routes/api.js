const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const jwt    = require('jsonwebtoken');
const config = require('../../config');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('Ok');
});

router.post('/auth', (req, res) => {
  	console.log('/api/auth')

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
				  user: {
				    username: user.username,
					password: null,
  				    name: user.name,
					channelPartner: user.channelPartner
				  }
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


var fake_channel_partners = [
	{ id: 'test1', name: 'Joe', recruiterURL: null },
	{ id: 'test2', name: 'Darrin', recruiterURL: null }
]

var fake_reports = [
	{ id: 'test1', title: 'Recruit Performance', cols: [{field: 'vin', header: 'Vin', sortable: true },{field: 'year', header: 'Year', sortable: true}] },
	{ id: 'test2', title: 'Recruit Orders', cols: [{field: 'vin', header: 'Vin', sortable: true},{field: 'make', header: 'Make', sortable: true}] }
]

router.get('/channel-partners', (req, res) => {
  res.send({
	  status: 200,
	  mesage: 'OK',
	  response: {
	  	totalRecords: 100,
		data: fake_channel_partners
	  }
  });
});

router.get('/channel-partners/:id', (req, res) => {
  var channelPartner = fake_channel_partners.find(function(element){ return element.id == req.params.id })

  res.send({
	  status: 200,
	  mesage: 'OK',
	  response: channelPartner
  });
});

router.get('/me', (req, res) => {
  res.send({
	  status: 200,
	  mesage: 'OK',
	  response: getCurrentChannelPartner()
  });
});



router.get('/reports', (req, res) => {
  res.send({
	  status: 200,
	  mesage: 'OK',
	  response: {
	  	totalRecords: 100,
		data: fake_reports
	  }
  });
});

router.get('/reports/:id', (req, res) => {

  var report = fake_reports.find(function(element){ return element.id == req.params.id })

  res.send({
	  status: 200,
	  mesage: 'OK',
	  response: report
  });
});

router.get('/reports/:id/results', (req, res) => {
  var rows = [];
  var limit = 20;


  var report = fake_reports.find(function(element){ return element.id == req.params.id })

  for (var i = 0; i < limit; i++) {
	  var row = {};
	  report['cols'].forEach(function(element){
	    row[element.field] = Math.random()
	  })

	  row.year = Math.random()
	  rows.push( row )
  }


  var results = {
	rows: rows,
	totalRecords: 100,
	chart: {
		type: 'line',
		data: {
	        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
	        datasets: [
	            {
	                label: 'First Dataset',
	                data: [65, 59, 80, 81, 56, 55, 40],
	                fill: false,
	                borderColor: '#4bc0c0'
	            },
	            {
	                label: 'Second Dataset',
	                data: [28, 48, 40, 19, 86, 27, 90],
	                fill: false,
	                borderColor: '#565656'
	            }
	        ]
	    }
	}
  }

  res.send({
    status: 200,
    mesage: 'OK',
    response: results
  });
});

function getCurrentChannelPartner( req ) {
	return fake_channel_partners[0]
}

module.exports = router;
