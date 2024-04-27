import type { APIInteraction } from "discord-api-types/v10";
import nacl from "tweetnacl";
import { stringToUint8Array, concatUint8Arrays } from "@/utils.js";

export const validateSignature = async (request: Request, env: Env): Promise<null | APIInteraction> => {
	const signature = request.headers.get("X-Signature-Ed25519");
	if (!signature) {
		return null;
	}

	const timestamp = request.headers.get("X-Signature-Timestamp");
	if (!timestamp) {
		return null;
	}

	const rawBody = await request.text();

	const timestampData = stringToUint8Array(timestamp);
	const bodyData = stringToUint8Array(rawBody);
	const message = concatUint8Arrays(timestampData, bodyData);

	const signatureData = stringToUint8Array(signature, "hex");
	const publicKeyData = stringToUint8Array(env.DISCORD_APP_PUBLIC_KEY, "hex");

	const isValid = nacl.sign.detached.verify(message, signatureData, publicKeyData);

	if (!isValid) {
		return null;
	}
	return JSON.parse(rawBody) as APIInteraction;
};
