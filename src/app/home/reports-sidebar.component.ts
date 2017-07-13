import {Component} from "@angular/core";
import { ReportsService } from './../services/reports.service';
import { Report } from './../model/report.model';

@Component({
    selector: 'reports-sidebar-app',
    templateUrl: './reports-sidebar.component.html'
})

export class ReportsSidebarComponent {
	reports : Array<Object>;

	constructor( private reportsService : ReportsService ) {
		reportsService.getReports().then((reports:Array<Report>) => {
			this.reports = reports
		})
	}

}
