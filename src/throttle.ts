const THROTTLE_TIME_S = 60;
export const throttleCommand = async ({ userId, command }: { userId: string; command: string }, env: Env) => {
	const key = `${userId}:${command}`;
	const throttleEntryForUser = await env.discord_code_review_bot_throttles.get(key, { type: "text" });

	if (throttleEntryForUser) {
		const throttledAt = new Date(throttleEntryForUser).getTime();
		const wait = Number.isNaN(throttledAt)
			? THROTTLE_TIME_S
			: THROTTLE_TIME_S - (Date.now() - throttledAt) / 1000;
		return {
			throttle: true,
			wait: wait > 0 ? Math.ceil(wait) : 1,
		} as const;
	}

	await env.discord_code_review_bot_throttles.put(key, new Date().toISOString(), {
		expirationTtl: THROTTLE_TIME_S,
	});

	return {
		throttle: false,
	} as const;
};
