import OpenAI from "openai";

import { type Ai } from "@cloudflare/ai";

export async function workersAiReview(code: string, { ai }: { ai: Ai }) {
	const results = (await ai.run("@hf/thebloke/deepseek-coder-6.7b-instruct-awq", {
		stream: false,
		messages: [
			{
				role: "system",
				content: [
					"You're a senior software developer and your sole responsibility is to review code submissions.",
					"Include information such as identified issues, recommendations for improvement, and areas of strength.",
					"Your feedback must be easy to understand and actionable to the developer.",
					"Be pragmatic and constructive in your feedback. Do not nitpick on small issues.",
					"Be concise.",
				].join(" "),
			},
			{
				role: "user",
				content: code,
			},
		],
	})) as { response?: string };

	return results.response;
}

export async function openAiReview(
	code: string,
	{ apiKey, baseURL }: { apiKey: string; baseURL: string },
): Promise<string | null | undefined> {
	const openai = new OpenAI({
		apiKey,
		baseURL,
	});

	const result = await openai.chat.completions.create({
		// model: "gpt-4-turbo-preview",
		// model: "mixtral-8x7b-32768",
		model: "gemma-7b-it",
		// model: "llama3-70b-8192",
		response_format: {
			type: "text",
		},
		stream: false,
		messages: [
			{
				role: "user",
				content: [
					`You're a senior software developer and your sole responsibility is to review code submissions.`,
					"Include information such as identified issues, recommendations for improvement, and areas of strength.",
					"Your feedback should be easy to understand, and actionable to the developer.",
					"Be pragmatic and constructive in your feedback. Do not nitpick on small issues.",
					"Be concise.",
					"\n",
					// "```",
					code,
					// "```",
				].join("\n"),
			},
		],
	});
	console.log(result);

	return result.choices[0]?.message.content;
}
