import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../common/auth.guard';

// Page Components
import { DashboardComponent } from "./dashboard.component";
import { RecruitersComponent } from "./recruiters.component";
import { ReportsComponent } from "./reports.component";


// Layout Components
import { ReportsSidebarComponent } from "./reports-sidebar.component";

// Services
import { AuthService } from './../services/auth.service';
import { ReportsService } from './../services/reports.service';
import { ChannelPartnersService } from './../services/channel-partners.service';


import { HomeRoutingModule } from './home-routing.module';

// PrimeNG Components
import { InputTextModule, ButtonModule, PasswordModule, GrowlModule, DataTableModule, ChartModule }  from 'primeng/primeng';


@NgModule({
  declarations: [
	DashboardComponent,
	RecruitersComponent,
	ReportsComponent,
	ReportsSidebarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
	ChartModule,
	DataTableModule,
    FormsModule,
	GrowlModule,
    HttpModule,
    InputTextModule,
    PasswordModule,
	HomeRoutingModule
  ],
  providers: [ AuthService, AuthGuard, ReportsService, ChannelPartnersService ],
})

export class HomeModule { }
