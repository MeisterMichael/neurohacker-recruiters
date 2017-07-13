import {Component, OnInit} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    private indextab: number = -1;

    constructor(private authService: AuthService, private router: Router) {

    }

    ngOnInit():void {
    }
}
