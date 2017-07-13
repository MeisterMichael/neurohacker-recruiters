import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../common/auth.guard';

// Page Components
import { DashboardComponent } from "./dashboard.component";
import { ToolsComponent } from "./tools.component";
import { ReportsComponent } from "./reports.component";


export const homeRoutes: Routes = [
    {
        path: 'tools',
        component: ToolsComponent,
		canActivate: [AuthGuard]
    },
    {
        path: 'reports',
        component: DashboardComponent,
		canActivate: [AuthGuard]
    },
    {
        path: 'report/:id',
        component: ReportsComponent,
		canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [
    RouterModule.forChild( homeRoutes )
  ],
  exports: [
    RouterModule
  ]
})

export class HomeRoutingModule {}
