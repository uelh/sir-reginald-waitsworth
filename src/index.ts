import "dotenv/config";
import fs from "fs";
import path from "path";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import type { BotCommand } from "./types/client";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection<string, BotCommand>();

const extension = __filename.endsWith(".ts") ? ".ts" : ".js";
console.log(
  `Running in ${extension === ".ts" ? "development" : "production"} mode`,
);

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(extension));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file)) as BotCommand;
  client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(extension));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_TOKEN);
