import {ChannelPartner} from "./channel-partner.model";

export interface User {
    username: string;
    password: string;
	name: string;
	channelPartner: ChannelPartner;

}
