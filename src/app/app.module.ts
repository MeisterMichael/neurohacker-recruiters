import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

// Modules
import { HomeModule } from "./home/home.module";

// Page Components
import { AppComponent } from './app.component';
import { LoginComponent } from "./login/login.component";

// Services
import { AuthService } from './services/auth.service';

import { AppRoutingModule } from './app-routing.module';

// PrimeNG Components
import { InputTextModule, ButtonModule, PasswordModule, GrowlModule, AccordionModule }  from 'primeng/primeng';


export const appRoutes: Routes = [

    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    }
];


@NgModule({
  declarations: [
    AppComponent,
	LoginComponent
  ],
  imports: [
  	AccordionModule,
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    FormsModule,
	GrowlModule,
    HttpModule,
    InputTextModule,
    PasswordModule,
	HomeModule,
	RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})

export class AppModule { }
