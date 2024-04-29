<div align="center">

# discord-code-review-bot
👉 https://www.0to1ai.com 👈

[![cover_0to1ai](https://github.com/0to1AI/discord-code-review-bot-cloudflare/assets/1338731/f8252417-ab01-4835-a141-789be5f27922)](https://www.0to1ai.com)

</div>


## What is it?
Code Review bot for Discord implemented using Cloudflare Workers and Groq.

<img src="https://github.com/0to1AI/discord-code-review-bot-cloudflare/assets/1338731/29e4a024-0856-4208-b5bb-4d74a9e32bbc" width="100">
     
<img src="https://github.com/0to1AI/discord-code-review-bot-cloudflare/assets/1338731/99594c9d-c8fa-415d-9183-1660f48622ae" width="125">

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
