import {Injectable} from "@angular/core";
import {User} from "../model/user.model";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';



@Injectable()
export class AuthService {

	constructor (private http: Http) {}

	accessToken(): String {
		return sessionStorage.getItem('AccessToken')
	}

	currentUser(): User {
		if ( sessionStorage.getItem('User') ) {
			return JSON.parse( sessionStorage.getItem('User') );
		} else {
			return null;
		}
	}

    login(user: User): Promise<boolean> {
		return this.http.post( "/api/auth", user )
			.toPromise()
			.then( function( response ) : boolean {
				response = response.json()
				if ( response.status == 200 ) {
					sessionStorage.setItem( 'AccessToken', response['response']['token'] )
					sessionStorage.setItem( 'User', JSON.stringify(response['response']['user']) )
					return true;
				} else {
					return false;
				}
			} );
    }


    isLogged(): boolean {
        if(typeof (Storage) !== 'undefined') {
            if(sessionStorage.getItem('AccessToken')) {
                return true;
            }
        }
        return false;
    }


    logout(): Promise<boolean> {
        sessionStorage.removeItem('AccessToken')
        sessionStorage.removeItem('User')
        return Promise.resolve(true);
    }

}
