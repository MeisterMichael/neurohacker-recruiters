import {Component, OnInit} from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './../model/user.model';
import { ChannelPartner } from './../model/channel-partner.model';
import { AuthService } from './../services/auth.service';

@Component({
    templateUrl: './recruiters.component.html'
})

export class RecruitersComponent implements OnInit {
    private indextab: number = -1;

	recruiterURL: String

    constructor( private route: ActivatedRoute, private authService : AuthService ) {

    }

    ngOnInit():void {
		this.recruiterURL = this.authService.currentUser().recruiterURL
    }

}
