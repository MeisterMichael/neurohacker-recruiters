

//Public
function Report( attributes ) {
	for (var prop in attributes) {
		this[prop] = attributes[prop];
	}
}
module.exports = Report;

Report.prototype.results = function( args = {}, callback ) {

	if ( !args.limit ) args.limit = 20

	var rows = []

	for (var i = 0; i < args.limit; i++) {
		var row = {};
		this.cols.forEach(function(element){
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

	callback( undefined, results )

}

Report.findOne = function( args, callback ){
	if ( !args )  args = {};

	var report = reports.find(function(element){ return element.id == args.id })

	callback( undefined, report )
}

Report.findAll = function( args, callback ){
	if ( !args )  args = {};

	callback( undefined, reports )

}



//Private
var reports = []

reports.push(
	new Report({
		id: 'test1',
		title: 'Recruit Performance',
		cols: [
			{field: 'vin', header: 'Vin', sortable: true },
			{field: 'year', header: 'Year', sortable: true}
		]
	})
)

reports.push(
	new Report({
		id: 'test2',
		title: 'Recruit Orders',
		cols: [
			{field: 'vin', header: 'Vin', sortable: true},
			{field: 'make', header: 'Make', sortable: true}
		]
	})
)
