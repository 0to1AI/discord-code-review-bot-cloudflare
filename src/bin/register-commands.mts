import { config } from "dotenv";
import { commands } from "@/commands.js";

config({ path: process.cwd() + "/.dev.vars" });

const DISCORD_APP_ID = process.env["DISCORD_APP_ID"];
const DISCORD_BOT_TOKEN = process.env["DISCORD_BOT_TOKEN"];

if (!DISCORD_APP_ID) {
	console.error("DISCORD_APP_ID is not set");
	process.exit(1);
}
if (!DISCORD_BOT_TOKEN) {
	console.error("DISCORD_BOT_TOKEN is not set");
	process.exit(1);
}

const URL = `https://discord.com/api/v10/applications/${DISCORD_APP_ID}/commands`;

const response = await fetch(URL, {
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
	},
	method: "PUT",
	body: JSON.stringify(Object.entries(commands).map(([name, command]) => ({ name, ...command }))),
});

if (response.ok) {
	console.log("Registered all commands");
	const data = await response.json();
	console.log(JSON.stringify(data, null, 2));
} else {
	console.error("Error registering commands");
	let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
	try {
		const error = await response.text();
		if (error) {
			errorText = `${errorText} \n\n ${error}`;
		}
	} catch (err) {
		console.error("Error reading body from request:", err);
	}
	console.error(errorText);
}
