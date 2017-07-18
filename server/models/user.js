
module.exports = {
	findOne: function( args, callback ){
		if ( !args )  args = {};

		args.username = 'michael'
		args.password = 'afvarfaweradcawefwevasdcasdf'
		args.channelPartner = {
			id: "michael1",
			name: "michael",
			recruiterURL: "http://test.com/cool/rassdfasefasdfasdf"
		}

		callback( undefined, args )

	}
}
