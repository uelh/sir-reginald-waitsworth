import { ChatInputCommandInteraction, Events, Interaction } from "discord.js";
import { BotCommand } from "../types/client";

export const name = Events.InteractionCreate;

export async function execute(interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName) as
    | BotCommand
    | undefined;
  if (!command) return;

  try {
    await command.execute(interaction as ChatInputCommandInteraction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "There was an error executing this command.",
      ephemeral: true,
    });
  }
}
