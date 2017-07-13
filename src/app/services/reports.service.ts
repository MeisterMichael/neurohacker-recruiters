import {Injectable} from "@angular/core";
import {Report} from "../model/report.model";
import {Results} from "../model/results.model";

@Injectable()
export class ReportsService {

	reports : Array<Report>

	constructor() {
		this.reports = [
			{ id: 'test1', title: 'Recruit Performance', cols: [{field: 'vin', header: 'Vin', sortable: true },{field: 'year', header: 'Year', sortable: true}] },
			{ id: 'test2', title: 'Recruit Orders', cols: [{field: 'vin', header: 'Vin', sortable: true},{field: 'make', header: 'Make', sortable: true}] }
		]
	}


    getReport(id: String): Promise<Report> {
		let report : Report = null
		this.reports.forEach( (value, key) => {
			if ( value.id == id ) {
				report = value;
			}
		})
        return Promise.resolve(report);
    }

	getResults( report: Report, args: Object = {} ) : Promise<Results> {
		console.log( 'getResults', report, args )
		let rows = []

		let offset = args['first'] || 0
		let limit = args['rows'] || 10
		let page = Math.round(limit / offset) + 1
		let sortField = args['sortField']
		let sortOrder = (args['sortOrder'] == 1 ? 'asc' : 'desc')
		let totalRecords = 0


		// @todo query api for data
		// FAKE DATA --------------
		totalRecords = 99
		for (let i = 0; i < limit; i++) {
			let row = {};
			report.cols.forEach( (col, key) => {
				row[col['field']] = Math.random()
			})
			rows.push( row )
		}
		// FAKE DATA --------------

		let results : Results = {
			rows: rows,
			totalRecords: totalRecords,
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

		return Promise.resolve( results )
	}


    getReports(): Promise<Array<Report>> {

        return Promise.resolve(this.reports);

    }

}
