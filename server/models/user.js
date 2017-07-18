


//Public
function User( attributes ) {
	for (var prop in attributes) {
		this[prop] = attributes[prop];
	}
}
module.exports = User;

User.findOne = function( args, callback ){
	if ( !args )  args = {};

	console.log( args )

	var user = null;
	if ( args.id ) user = users.find(function(element){ return element.id == args.id })
	if ( args.username && args.password ) user = users.find(function(element){ return element.username == args.username && element.password == args.password })

	callback( undefined, user )
}

User.findAll = function( args, callback ){
	if ( !args )  args = {};

	callback( undefined, users )

}



//Private
var users = []

users.push(
	new User({
		id: 1,
		name: "Michael Ferguson",
		username: "michael",
		email: "meister@spacekace.com",
		password: "boo11",
		channelPartner: {
			id: 99,
			name: "Michael Ferguson",
			recruiterURL: "http://test.com/cool/rassdfasefasdfasdf"
		}
	})
)
