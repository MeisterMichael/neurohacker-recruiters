import {Component, OnInit} from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Report } from './../model/report.model';
import { Results } from './../model/results.model';
import { ReportsService } from './../services/reports.service';

@Component({
    templateUrl: './reports.component.html'
})

export class ReportsComponent implements OnInit {
    private indextab: number = -1;

	report: Report
	rows: Array<Object>
	cols: Array<Object>
	totalRecords: Number = 0
	rowsPerPage: Number = 20
	chartType: String = null
	chartData: any = null

    constructor( private route: ActivatedRoute, private reportsService : ReportsService ) {
    }

    ngOnInit():void {
		this.route.params.forEach((params: Params) => {
	         if (params['id'] !== undefined) {
	           this.reportsService.getReport( params['id'] )
	              .then( report => {
					  this.report = report
					  this.rows = []
					  this.chartType = null
					  this.chartData = null
					  this.cols = report.cols

					  // @todo load first set of records
					  this.reportsService.getResults( report, { rows: this.rowsPerPage, first: 0 } ).then( results => {
						  this.totalRecords = results.totalRecords
						  this.rows = results.rows

						  if ( results.chart ) {
	  						  this.chartType = results.chart['type']
	  						  this.chartData = results.chart['data']
						  }

					  })
				  });
	         }
	       });
    }

	loadRowsLazy(event: Object) {
		console.log( 'loadRowsLazy', event );
		//in a real application, make a remote request to load data using state metadata from event
        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort with
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

        //imitate db connection over a network
        setTimeout(() => {
			this.reportsService.getResults( this.report, event ).then( results => {
				this.totalRecords = results.totalRecords
				this.rows = results.rows
			})
        }, 250);
	}


}
