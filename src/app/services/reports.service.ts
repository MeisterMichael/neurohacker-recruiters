import {Injectable} from "@angular/core";
import {Report} from "../model/report.model";
import {Results} from "../model/results.model";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AuthService } from "./auth.service";

@Injectable()
export class ReportsService {

	constructor(private http: Http, private authService: AuthService) {}

    getReport(id: String): Promise<Report> {

		return this.http.get( "/api/reports/"+id, { params: { token: this.authService.accessToken() } } )
			.toPromise()
			.then( function( response ) : Report {
				response = response.json()
				if ( response.status == 200 ) {
					return response['response'];
				} else {
					return null;
				}
			} );
    }

	getResults( report: Report, args: Object = {} ) : Promise<Results> {
		let rows = []

		let offset = args['first'] || 0
		let limit = args['rows'] || 10
		let page = Math.round( offset / limit ) + 1
		let sortField = args['sortField']
		let sortOrder = (args['sortOrder'] == 1 ? 'asc' : 'desc')
		let totalRecords = 0

		let filters = {}
		report.filters.forEach(function(filter){
			if( typeof filter['value'] == 'object' ) {
				Object.keys(filter['value']).forEach(function(key){

					filters[filter['field']+"["+key+"]"] = filter['value'][key]
				})
			} else {
				filters[filter['field']] = filter['value']
			}
		})


		return this.http.get( "/api/reports/"+report.id+"/results", { params: Object.assign( filters, { token: this.authService.accessToken(), offset: offset, limit: limit, page: page, sortField: sortField, sortOrder: sortOrder } ) } )
			.toPromise()
			.then( function( response ) : Results {
				response = response.json()
				if ( response.status == 200 ) {
					return response['response'];
				} else {
					return null;
				}
			} );
	}


    getReports(): Promise<Array<Report>> {

		return this.http.get( "/api/reports", { params: { token: this.authService.accessToken() } } )
			.toPromise()
			.then( function( response ) : Array<Report> {
				response = response.json()
				if ( response.status == 200 ) {
					return response['response']['data'];
				} else {
					return null;
				}
			} );
    }

}
