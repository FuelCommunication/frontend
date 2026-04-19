import type {FormSubmitEvent} from "@nuxt/ui";
import type {ZodSchema} from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AuthFormProps<T = any, F = any> {
    schema: ZodSchema<T>;
    title: string;
    description: string;
    fields: F[];
    loading?: boolean;
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
	expires_at: number;
}

export interface LoginResponse {
	user: User;
	session: Session;
}
