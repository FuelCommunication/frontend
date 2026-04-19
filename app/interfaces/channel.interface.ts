export interface Channel {
	id: string;
	title: string;
	description: string;
	avatar_url?: string | null;
}

export interface Subscription {
	id: string;
	title: string;
	description: string;
	avatar_url: string | null;
	subscribers_count: number;
}



export interface PaginatedResponse<T> {
	items: T[];
	limit: number;
	offset: number;
	total: number;
}
