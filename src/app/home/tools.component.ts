import {Component, OnInit} from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './../model/user.model';
import { ChannelPartner } from './../model/channel-partner.model';
import { AuthService } from './../services/auth.service';

@Component({
    templateUrl: './tools.component.html'
})

export class ToolsComponent implements OnInit {
    private indextab: number = -1;

	channelPartner : ChannelPartner
	recruiterURL: String

    constructor( private route: ActivatedRoute, private authService : AuthService ) {

    }

    ngOnInit():void {
		this.channelPartner = this.authService.currentUser().channelPartner
		this.recruiterURL = this.channelPartner.recruiterURL
    }

}
