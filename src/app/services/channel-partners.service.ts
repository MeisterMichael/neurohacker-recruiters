import {Injectable} from "@angular/core";
import {ChannelPartner} from "../model/channel-partner.model";

@Injectable()
export class ChannelPartnersService {

	channelPartners : Array<ChannelPartner>

	constructor() {
		this.channelPartners = [
			{ id: 'test1', name: 'Joe', recruiterURL: null },
			{ id: 'test2', name: 'Darrin', recruiterURL: null }
		]
	}



    getChannelPartner(id: String): Promise<ChannelPartner> {
		let channelPartner : ChannelPartner = null
		this.channelPartners.forEach( (value, key) => {
			if ( value.id == id ) {
				channelPartner = value;
			}
		})
        return Promise.resolve(channelPartner);
    }


    getChannelPartners(): Promise<Array<ChannelPartner>> {

        return Promise.resolve(this.channelPartners);
    }

}
