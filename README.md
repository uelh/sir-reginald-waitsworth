<p align="center">
  <img src="./assets/sir-reginald.png" width="200" alt="Sir Reginald Waitsworth" />
</p>

<h1 align="center">Sir Reginald Waitsworth</h1>
<p align="center"><em>A Discord bot to log, track, and gently shame friends who say “brb” and never return.</em></p>

## Features

- `/wait` – Log a delay against someone who took too long to return
- `/unwait` – Forgive someone and remove their most recent log
- `/stats` – View your own delay history, complete with timestamps and reasons
- `/waitboard` – View the top (or rather, bottom) punctuality offenders
- `/resetwaits` – Wipe the slate clean for a new month or a fresh start

## Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/uelh/sir-reginald-waitsworth.git
cd sir-reginald-waitsworth
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env` file:**

```
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_discord_client_id
GUILD_ID=your_server_id
```

4. **Deploy your slash commands:**

```bash
npm run build
node dist/deploy-commands.js
```

5. **Start the bot:**

```bash
npm run start
```

## Prerequisites

- Node.js v18+
- Discord bot with the `applications.commands` and `bot` scopes
- Basic familiarity with Discord’s Developer Portal

## License

[MIT](./LICENSE.md)
