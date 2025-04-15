import {
  Client,
  Collection,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
} from "discord.js";

export interface BotCommand {
  data: SlashCommandBuilder;
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => Promise<void>;
}

declare module "discord.js" {
  interface Client {
    commands: Collection<string, BotCommand>;
  }
}
