import { Client } from "discord.js";

export const name = "ready";
export const once = true;

export function execute(client: Client): void {
  console.log(`Logged in as ${client.user?.tag}`);

  client.user?.setPresence({
    status: "online",
    activities: [
      {
        name: "the clock",
        type: 3, // Watching
      },
    ],
  });
}
