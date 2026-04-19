import type {Session} from "~/interfaces/auth.interfaces";

export default defineNuxtRouteMiddleware(() => {
	const session = useCookie<{session: Session | undefined}>("auth")
	if (!session.value) {
	    return navigateTo("/account/login")
	}
});
