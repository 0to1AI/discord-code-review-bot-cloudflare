import { InteractionResponseType } from "discord-api-types/v10";
import type { CommandEntry } from "@/commands/types.js";

export const ping: CommandEntry = {
	description: "Ping pong! I'll respond with pong.",
	handler: async () => ({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: { content: `Pong` },
	}),
};
