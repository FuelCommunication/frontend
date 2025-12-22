export interface Channel {
	id: string;
	title: string;
	description: string;
	avatar_url?: string;
	// unread: boolean;
}

export interface Channels {
	items: Channel[];
	limit: number;
	offset: number;
	total: number;
}
