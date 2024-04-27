import type {
	APIApplicationCommandInteraction,
	APIInteractionResponse,
	APIMessage,
	APIModalSubmitInteraction,
} from "discord-api-types/v10";

export type CommandHandler = (
	interaction: APIApplicationCommandInteraction,
) => Promise<APIInteractionResponse>;

export type ModalHandler = (interaction: APIModalSubmitInteraction, env: Env) => Promise<Partial<APIMessage>>;

export type CommandEntry =
	| {
			description: string;
			handler: CommandHandler;
	  }
	| {
			description: string;
			handler: CommandHandler;
			modalHandler: ModalHandler;
			modalId: string;
	  };

export type Commands = Record<string, CommandEntry>;
