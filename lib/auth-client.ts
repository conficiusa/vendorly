import { createAuthClient } from "better-auth/react";
import {
	inferAdditionalFields,
	twoFactorClient,
} from "better-auth/client/plugins";
import { auth } from "@/lib/auth";

export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */

	plugins: [twoFactorClient(), inferAdditionalFields<typeof auth>()],
});
