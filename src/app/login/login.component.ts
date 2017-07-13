
import { Component, OnInit } from "@angular/core";
import { ChannelPartner } from "../model/channel-partner.model";
import { User } from "../model/user.model";
import { AuthService } from "../services/auth.service";

import { Message } from 'primeng/primeng';
import { Router } from "@angular/router";

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
    private username: string;
    private password: string;
    private msgs: Message[] = [];

    constructor(private authService: AuthService, private router: Router) {

    }

    ngOnInit():void {
		if(this.authService.isLogged()) {
			this.router.navigate(['/reports']);
		}
    }

    public login(): void {
        let user: User = {
            username: this.username,
            password: this.password,
			name: null,
			channelPartner: null
        }
        this.authService.login(user).then((result:boolean) => {
            if(result) {
                this.router.navigate(['/reports']);
            } else {
                this.msgs.push({severity:'error', summary:'Invalid Login', detail:'The username and/or password were incorrect.'});
            }
        })

    }
}
