import "dotenv/config";
import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";

const commands: any[] = [];

const extension = __filename.endsWith(".ts") ? ".ts" : ".js";
console.log(
  `Running in ${extension === ".ts" ? "development" : "production"} mode`,
);

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(extension));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.data) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log("Refreshing slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID!,
      ),
      {
        body: commands,
      },
    );

    console.log("Slash commands registered!");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
})();
