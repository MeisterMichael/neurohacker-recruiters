const db = require('./database');

//Public
function Report( attributes ) {
	for (var prop in attributes) {
		this[prop] = attributes[prop];
	}
}
module.exports = Report;

Report.prototype.results = function( args = {}, callback ) {

	if ( !args.limit ) args.limit = 20

	var query = this.query.sql+" LIMIT $"+(this.query.params.length+1)
	var values = []

	this.query.params.forEach(function( paramName ){
		values.push( args[paramName] )
	})
	values.push( args.limit )


	db.query(query, values, (err, res) => {

		if ( err ) {
			console.log(err, query)
			callback( err, undefined )
		} else {

			var results = {
				rows: res.rows,
				totalRecords: res.rowCount,
				chart: null
			}

			callback( undefined, results )
		}


	})




}


Report.prototype.publicAttributes = function(){
	return {
		id: this.id,
		title: this.title,
		cols: this.cols
	}
}

Report.findOne = function( args, callback ){
	if ( !args ) args = {};

	var report = reports.find(function(element){ return element.id == args.id })

	callback( undefined, report )
}

Report.findAll = function( args, callback ){
	if ( !args ) args = {};

	callback( undefined, reports.slice(0) )

}



//Private
var reports = []

reports.push(
	new Report({
		id: 'recruits',
		title: 'My Recruits',
		query: {
			sql: 'SELECT name, COUNT(CASE WHEN transaction_items.transaction_type = 1 THEN 1 END) unitssold, COUNT(CASE WHEN transaction_items.transaction_type = -1 THEN 1 END) unitsrefunded FROM channel_partners LEFT JOIN transaction_items ON transaction_items.channel_partner_id = channel_partners.id WHERE parent_id = $1 GROUP BY channel_partners.id',
			params: [ 'channelPartnerId' ],
			defaults: {  }
		},
		cols: [
			{ field: 'name', header: 'Recruit\'s Name', sortable: false },
			{ field: 'unitssold', header: 'Units Sold', sortable: false },
			{ field: 'unitsrefunded', header: 'Units Refunded', sortable: false }
		]
	})
)

// reports.push(
// 	new Report({
// 		id: 'test2',
// 		title: 'Recruit Orders',
// 		query: 'sql and stuff',
// 		cols: [
// 			{ field: 'vin', header: 'Vin', sortable: false },
// 			{ field: 'make', header: 'Make', sortable: false }
// 		]
// 	})
// )
