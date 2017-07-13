import {Injectable} from "@angular/core";
import {Report} from "../model/report.model";
import {Results} from "../model/results.model";

@Injectable()
export class ReportsService {

	reports : Array<Report>

	constructor() {
		this.reports = [
			{ id: 'test1', title: 'Recruit Performance', cols: [{field: 'vin', header: 'Vin', sortable: true },{field: 'year', header: 'Year', sortable: true}], rows: [] },
			{ id: 'test2', title: 'Recruit Orders', cols: [{field: 'vin', header: 'Vin', sortable: true},{field: 'make', header: 'Make', sortable: true}], rows: [] }
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
			totalRecords: totalRecords
		}

		return Promise.resolve( results )
	}


    getReports(): Promise<Array<Report>> {

        return Promise.resolve(this.reports);

    }

}
