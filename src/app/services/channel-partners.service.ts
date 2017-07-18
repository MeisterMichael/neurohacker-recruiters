import {Injectable} from "@angular/core";
import {ChannelPartner} from "../model/channel-partner.model";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ChannelPartnersService {

	// FAKE DATA --------------
	channelPartners : Array<ChannelPartner>
	// FAKE DATA --------------

	constructor() {
		// FAKE DATA --------------
		this.channelPartners = [
			{ id: 'test1', name: 'Joe', recruiterURL: null },
			{ id: 'test2', name: 'Darrin', recruiterURL: null }
		]
		// FAKE DATA --------------
	}



    getChannelPartner(id: String): Promise<ChannelPartner> {
		let channelPartner : ChannelPartner = null

		// @todo query api for data
		// FAKE DATA --------------
		this.channelPartners.forEach( (value, key) => {
			if ( value.id == id ) {
				channelPartner = value;
			}
		})
		// FAKE DATA --------------

        return Promise.resolve(channelPartner);
    }


    getChannelPartners(): Promise<Array<ChannelPartner>> {

		// @todo query api for data
		// FAKE DATA --------------
        return Promise.resolve(this.channelPartners);
		// FAKE DATA --------------
    }

}
