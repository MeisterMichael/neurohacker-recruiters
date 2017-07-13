import { Component , ViewEncapsulation, OnInit } from '@angular/core';
import { Router, RouterLink }  from '@angular/router';

import {LoginComponent}		from './login/login.component';
import {AuthService}	from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {

    constructor(private router : Router, private authService : AuthService){
        //this._router.navigate(['Login']);
    }

    ngOnInit() {
    }

	public logout(): void {
		this.authService.logout().then((result:boolean) => {
			this.router.navigate(['/login']);
		})
	}

}
