import { ping } from "@/commands/ping.js";
import { review } from "@/commands/review.js";
import type { Commands } from "@/commands/types.js";

export const commands = {
	ping,
	review,
} as const satisfies Commands;
