import { InteractionResponseType, InteractionType, type APIInteractionResponse } from "discord-api-types/v10";
import { commands } from "@/commands/index.js";
import { throttleCommand } from "@/throttle.js";
import { review } from "@/commands/review.js";
import { validateSignature } from "@/crypto.js";

export default {
	async fetch(request: Request, env, ctx) {
		if (request.method !== "POST") {
			return new Response("Invalid method", { status: 405, headers: { Allow: "POST" } });
		}

		const interaction = await validateSignature(request, env);
		if (!interaction) {
			return new Response("Invalid request signature", { status: 401 });
		}

		if (interaction.type === InteractionType.Ping) {
			return Response.json({ type: InteractionResponseType.Pong } satisfies APIInteractionResponse);
		}

		if (interaction.type === InteractionType.ApplicationCommand) {
			const { name } = interaction.data;

			const command = name in commands ? commands[name as keyof typeof commands] : null;

			if (!command) {
				return new Response(`Unknown command ${name}`, { status: 400 });
			}

			const result = await command.handler(interaction);
			return Response.json(result);
		}

		if (interaction.type === InteractionType.ModalSubmit) {
			if (interaction.data.custom_id === review.modalId) {
				if (!interaction.member?.user.id) {
					return new Response("User not found", { status: 400 });
				}

				const shouldThrottle = await throttleCommand(
					{ userId: interaction.member.user.id, command: "review_modal" },
					env,
				);
				if (shouldThrottle.throttle) {
					return Response.json({
						type: InteractionResponseType.ChannelMessageWithSource,
						data: { content: `You need to wait ${shouldThrottle.wait}s to review again.` },
					} satisfies APIInteractionResponse);
				}

				ctx.waitUntil(
					review.modalHandler(interaction, env).then(async (apiMessage) => {
						const endpoint = `https://discord.com/api/v10/webhooks/${env.DISCORD_APP_ID}/${interaction.token}/messages/@original`;
						const discordResponse = await fetch(endpoint, {
							method: "PATCH",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
							},
							body: JSON.stringify(apiMessage),
						});
						if (!discordResponse.ok) {
							console.error(`Failed to send message: ${discordResponse.status}`);
							console.error(await discordResponse.text());
						}
					}),
				);

				return Response.json({
					type: InteractionResponseType.DeferredChannelMessageWithSource,
				} satisfies APIInteractionResponse);
			}
		}

		return new Response("Invalid interaction type", { status: 400 });
	},
} satisfies ExportedHandler<Env>;
