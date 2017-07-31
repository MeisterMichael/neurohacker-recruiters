const db = require('./database');

//Public
function Report( attributes ) {
	for (var prop in attributes) {
		this[prop] = attributes[prop];
	}
}
module.exports = Report;



Report.prototype.resultsChart = function( args = {}, callback ) {

	var values = [];
	this.query.params.forEach(function( paramName ){
		values.push( args[paramName] )
	})

	db.query(this.query.chart, values, (err, res) => {

		if ( err ) {
			console.log('resultsChart', err, this.query.chart, [])
			callback( err, undefined )
		} else {
			var results = Object.assign( { data: { labels: [], datasets: [] } }, this.chart );

			var datasets = {}

			res.rows.forEach(function( row ){
				if( !datasets[row['row_label']] )
					datasets[row['row_label']] = []

				datasets[row['row_label']].push( row['value'] )

				if ( results.data.labels.indexOf(row['col_label']) === -1 )
					results.data.labels.push(row['col_label'])
			})

			Object.keys(datasets).forEach(function(label){
				results.data.datasets.push({
					label: label,
					data: datasets[label]
				})
			})

			callback( err, results )
		}


	})
}

Report.prototype.resultsRows = function( args = {}, callback ) {

	var countQuery = this.query.count
	var rowQuery = this.query.sql+" OFFSET $"+(this.query.params.length+1)+" LIMIT $"+(this.query.params.length+2)
	var values = []

	this.query.params.forEach(function( paramName ){
		values.push( args[paramName] )
	})
	values.push( args.offset )
	values.push( args.limit )

	db.query(rowQuery, values, (err, res) => {

		if ( err ) {
			console.log('rowQuery', err, rowQuery, values)
			callback( err, undefined )
		} else {

			var results = {
				rows: res.rows,
				totalRecords: 0
			}


			db.query(countQuery, values.slice(0,-2), (err, res) => {

				if ( err ) {
					console.log( 'countQuery', err, query, values)
					callback( err, undefined )
				} else {

					results.totalRecords = res.rows[0].count;

					callback( undefined, results )
				}


			})
		}


	})

}

Report.prototype.results = function( args = {}, callback ) {

	if ( !args.limit ) args.limit = 20
	if ( !args.offset ) args.offset = 0

	Object.keys(args).forEach(function(argKey){
		if( typeof args[argKey] == 'object' ) {
			Object.keys(args[argKey]).forEach(function(key){
				args[argKey+"["+key+"]"] = args[argKey][key]
			})
		}
	})

	var report = this;

	if( report.query.chart ) {
		report.resultsChart( args, function( err, chartResults ){
			if ( err ) {
				callback( err, null )
			} else {
				report.resultsRows( args, function( err, results ) {
					if( results )
						results.chart = chartResults

					callback( err, results )
				} )
			}
		} )
	} else {
		report.resultsRows( args, callback )
	}


}


Report.prototype.publicAttributes = function(){
	var filters = []
	this.filters.forEach( function(value, index){

		var filter = Object.assign({},value)
		if ( value.defaultValue ) filter = Object.assign(filter,{ value: eval("(function(){return "+value.defaultValue+"})()"), defaultValue: null })

		filters.push(filter)
	})

	return {
		id: this.id,
		title: this.title,
		cols: this.cols,
		filters: filters
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

// reports.push(
// 	new Report({
// 		id: 'recruits',
// 		title: 'My Recruits',
// 		query: {
// 			count: 'SELECT COUNT(*) as "count" FROM channel_partners WHERE parent_id = $1 GROUP BY channel_partners.id',
// 			sql: 'SELECT name, COUNT(CASE WHEN transaction_items.transaction_type = 1 THEN 1 END) unitssold, COUNT(CASE WHEN transaction_items.transaction_type = -1 THEN 1 END) unitsrefunded FROM channel_partners LEFT JOIN transaction_items ON transaction_items.channel_partner_id = channel_partners.id WHERE parent_id = $1 GROUP BY channel_partners.id',
// 			params: [ 'channelPartnerId' ],
// 			defaults: {  }
// 		},
// 		cols: [
// 			{ field: 'name', header: 'Recruit\'s Name', sortable: false },
// 			{ field: 'unitssold', header: 'Units Sold', sortable: false },
// 			{ field: 'unitsrefunded', header: 'Units Refunded', sortable: false }
// 		],
// 		filters: []
// 	})
// )

reports.push(
	new Report({
		id: 'recruits-transactions',
		title: 'Recruit Transactions',
		query: {
			count: 'SELECT COUNT(distinct src_transaction_id) FROM channel_partners INNER JOIN transaction_items ON transaction_items.channel_partner_id = channel_partners.id WHERE parent_id = $1 AND transaction_items.src_created_at >= $2 AND date_trunc(\'day\', transaction_items.src_created_at) <= $3',
			sql: 'SELECT name, to_char( MAX(transaction_items.src_created_at), \'MM/DD/YYYY\') src_created_at, MAX(src_order_label) src_order_label, ROUND(SUM(total) / 100.0, 2)::money total FROM channel_partners INNER JOIN transaction_items ON transaction_items.channel_partner_id = channel_partners.id WHERE parent_id = $1 AND transaction_items.src_created_at >= $2 AND date_trunc(\'day\', transaction_items.src_created_at) <= $3 GROUP BY channel_partners.id, transaction_items.src_transaction_id',
			chart: 'SELECT name as row_label, to_char( MAX(transaction_items.src_created_at), \'MM/DD/YYYY\') as col_label, ROUND(SUM(total) / 100.0, 2)::money as "value" FROM channel_partners INNER JOIN transaction_items ON transaction_items.channel_partner_id = channel_partners.id WHERE parent_id = $1 AND transaction_items.src_created_at >= $2 AND date_trunc(\'day\', transaction_items.src_created_at) <= $3 GROUP BY channel_partners.id, to_char( transaction_items.src_created_at, \'MM/DD/YYYY\')',
			params: [ 'channelPartnerId','transaction_items.src_created_at[min]', 'transaction_items.src_created_at[max]' ],
			defaults: {  }
		},
		chart: {
			type: 'line',
			options: {
				title: {
					display: false
				},
	            legend: {
	                position: 'bottom'
	            }
			}
		},
		cols: [
			{ field: 'name', header: 'Recruit', sortable: false },
			{ field: 'src_order_label', header: 'Order ID', sortable: false },
			{ field: 'src_created_at', header: 'Date', sortable: false },
			{ field: 'total', header: 'Total', sortable: false }
		],
		filters: [
			// { field: 'channel_partners.id', label: 'Recruit', input: 'p-multiSelect', options: {  } },
			{ field: 'transaction_items.src_created_at', label: 'Date Range', input: 'p-calendar-range', value: { min: '', max: '' }, defaultValue: "{ \"min\": ((new Date()).getMonth()+1)+'/1/'+(new Date()).getFullYear(), \"max\": ((new Date()).getMonth()+1)+'/'+(new Date()).getDate()+'/'+(new Date()).getFullYear() }", options: {  } }
		]
	})
)
