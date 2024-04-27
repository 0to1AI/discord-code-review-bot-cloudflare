import {
	ComponentType,
	InteractionResponseType,
	TextInputStyle,
	type APIMessage,
	type APIModalSubmitInteraction,
} from "discord-api-types/v10";
import type { CommandEntry } from "@/commands/types.js";
import { openAiReview } from "@/ai.js";
import { unpackPromise } from "@/utils.js";

const modalId = "review_modal";
const codeInputId = "review_modal-code_input";

export const review = {
	description: "Review the code",
	handler: async () => {
		return {
			type: InteractionResponseType.Modal,
			data: {
				title: "Code Review",
				custom_id: modalId,
				components: [
					{
						type: ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.TextInput,
								custom_id: codeInputId,
								label: "Enter Code Snippet",
								style: TextInputStyle.Paragraph,
								required: true,
							},
						],
					},
				],
			},
		};
	},

	modalId,
	modalHandler: async (interaction, env) => {
		const [modalError, modalResponse] = await unpackPromise(handleModalSubmit(interaction, env));

		if (modalError) {
			console.error(modalError);
		}
		const apiMessage: Partial<APIMessage> = modalError
			? { content: "I'm sorry, I couldn't provide a review at this time." }
			: modalResponse;

		return apiMessage;
	},
} as const satisfies CommandEntry;

async function handleModalSubmit(interaction: APIModalSubmitInteraction, env: Env) {
	const [codeSnippet] = interaction.data.components
		.flatMap((cs) => cs.components)
		.filter((c) => c.custom_id === codeInputId);

	if (!codeSnippet) {
		throw new Error("Code snippet not found");
	}

	// Groq
	const review = await openAiReview(codeSnippet.value, {
		apiKey: env.GROQ_API_KEY,
		baseURL: env.GROQ_BASE_URL,
	});

	// Workers AI
	// const review = await workersAiReview(codeSnippet.value, {
	// 	ai: new Ai(env.ai),
	// });

	if (!review) {
		throw new Error("Failed to get review");
	}

	const reviews = Array.from(review.match(/.{1,1000}/gs) ?? []);
	const codeSnippets = Array.from(codeSnippet.value.match(/.{1,1000}/gs) ?? []);

	// console.log(codeSnippets.length, reviews.length);

	return {
		embeds: [
			{
				fields: [
					...codeSnippets.map((codeSnippet, idx) => ({
						name: idx === 0 ? "Code Snippet" : "",
						value: ["```", codeSnippet.replaceAll("`", "\\`"), "```"].join("\n"),
					})),
					...reviews.map((review, idx) => ({
						name: idx === 0 ? "Review" : "",
						value: review,
					})),
				],
			},
		],
	};
}
