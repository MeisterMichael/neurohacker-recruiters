
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

var default_query = "SELECT users.\"name\" as \"username\", users.encrypted_password, users.email, (users.first_name || ' ' || users.last_name) \"name\", channel_partners.id \"channelPartnerId\", (CASE WHEN channel_partners.refersion_channel_partner_id IS NOT NULL THEN 'https://neurohacker.refersion.com/?nhpid='||channel_partners.refersion_channel_partner_id ELSE 'N/A' END) \"recruiterURL\" FROM users INNER JOIN channel_partners ON channel_partners.user_id = users.id WHERE users.\"role\" = 'channel_partner_recruiter' "
var column_map = { id: '\"users\".\"id\"', username: '\"users\".\"name\"', email: '\"users\".\"email\"', name: "(\"users\".\"first_name\" || ' ' || \"users\".\"last_name\")", channelPartnerId: "\"channel_partners\".\"id\"" }

User.prototype.publicAttributes = function(){
	return {
		id: this.id,
		username: this.username,
		email: this.email,
		name: this.name,
		channelPartnerId: this.channelPartnerId,
		recruiterURL: this.recruiterURL
	}
}

User.findOne = function( args, callback ){
	if ( !args ) args = {};
	var query = ""+default_query;

	var values = []

	Object.keys(args).forEach( function(key){
		if ( column_map[key] ) {
			values.push( args[key] )
			query = query + " AND "+column_map[key]+" = $"+values.length
		}
	})

	db.query(query, values, (err, res) => {
		var user = null;

		if( !err && res.rows.length > 0 ) {

			user = new User( res.rows[0] )

			if( args.password && !bcrypt.compareSync( args.password, user.encrypted_password ) ) user = null
		}

		callback( err, user )
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
