import type {FormSubmitEvent} from "@nuxt/ui";

export interface AuthFormProps<T, F> {
    schema: any;
    title: string;
    description: string;
    fields: F[];
    submitHandler: (payload: FormSubmitEvent<T>) => Promise<void>;
    backRoute: string;
    backLabel: string;
}

export interface User {
	id: string;
	email: string;
	username: string;
	avatar_url?: string | null;
	bio?: string | null;
}

export interface Session {
	access_token: string;
	tokenType: string;
	refreshToken?: string;
	expiresIn: number;
}

export interface LoginResponse {
	user: User;
	session: Session;
}
