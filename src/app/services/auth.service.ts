import {Injectable} from "@angular/core";
import {User} from "../model/user.model";

@Injectable()
export class AuthService {

	currentUser(): User {
		console.log( "sessionStorage.getItem('User')", sessionStorage.getItem('User') )
		if ( sessionStorage.getItem('User') ) {
			return JSON.parse( sessionStorage.getItem('User') );
		} else {
			return null;
		}

	}

    login(user: User): Promise<boolean> {

		// @todo query api for user and channel partner
		// FAKE DATA --------------
        if(user.username == 'mike' && user.password == 'test') {
			user.name = 'Boo Hoo'
			user.channelPartner = { id: 'test', name: 'Boo', recruiterURL: 'http://localhost:4200/tools/boo' }

            if(typeof (Storage) !== 'undefined') {
                sessionStorage.setItem('User',JSON.stringify(user));
            }

            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
		// FAKE DATA --------------
    }


    isLogged(): boolean {
        if(typeof (Storage) !== 'undefined') {
            if(sessionStorage.getItem('User')) {
                return true;
            }
        }
        return false;
    }


    logout(): Promise<boolean> {
        sessionStorage.removeItem('User')
        return Promise.resolve(true);
    }

}
