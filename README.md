# discord-code-review-bot

Code Review bot for Discord implemented using Cloudflare Workers AI.

👉 https://www.0to1ai.com

## Development

### Install pnpm

The easiest way to install pnpm is via Node.js Corepack. Inside the folder with the bot, run these commands:

```bash
corepack enable
corepack install
```

Alternatively, follow the instructions for your operating system found here: [pnpm.io/installation](https://pnpm.io/installation)

### Prepare the environment

Install the dependencies:

```bash
pnpm install
```

Copy `wrangler-example.toml` to `wrangler.toml` and `.dev.vars-example` to `.dev.vars` and fill in the necessary values.

You'll need a Cloudflare account and a Discord bot token to proceed.

### Run the bot

```bash
pnpm dev
```
