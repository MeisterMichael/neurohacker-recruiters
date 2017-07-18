
const db = require('./database');
var bcrypt = require('bcrypt');
const config	= require('../../config');

//Public
function User( attributes ) {
	for (var prop in attributes) {
		this[prop] = attributes[prop];
	}
}
module.exports = User;

var default_query = "SELECT \"name\" as \"username\", encrypted_password, email, (first_name || ' ' || last_name) \"name\" FROM users WHERE \"role\" = 'channel_partner' "
var column_map = { id: 'id', username: 'name', email: 'email', name: "(first_name || ' ' || last_name)" }

User.findOne = function( args, callback ){
	if ( !args ) args = {};
	var query = ""+default_query;

	var values = []

	Object.keys(args).forEach( function(key){
		if ( column_map[key] ) {
			values.push( args[key] )
			query = query + " AND \""+column_map[key]+"\" = $"+values.length
		}
	})

	db.query(query, values, (err, res) => {
		var user = new User( res.rows[0] )
		if( args.password && !bcrypt.compareSync( args.password, user.encrypted_password ) ) user = null

		callback( undefined, user )
	})

}

User.findAll = function( args, callback ){
	if ( !args ) args = {};
	var query = ""+default_query;

	var values = []

	Object.keys(args).forEach( function(key){
		if ( column_map[key] ) {
			values.push( args[key] )
			query = query + " AND \""+column_map[key]+"\" = $"+values.length
		}
	})

	db.query(query, values, (err, res) => {
		var users = []
		res.rows.forEach(function( row ){
			var user = new User( row )
			users.push(user)
		})
		callback( undefined, users )
	})

}

//Private
