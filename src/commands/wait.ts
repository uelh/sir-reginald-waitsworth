import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
} from "discord.js";
import fs from "fs";
import path from "path";
import { WaitData } from "../types/wait";

const dataDir = path.join(__dirname, "../../data");
const dataPath = path.join(dataDir, "data.json");

export const data = new SlashCommandBuilder()
  .setName("wait")
  .setDescription("Log someone for keeping the group waiting.")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The person who took far too long to return")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("An optional reason for their most egregious delay"),
  );

export async function execute(
  interaction: ChatInputCommandInteraction<CacheType>,
) {
  const user = interaction.options.getUser("user", true);
  const reason =
    interaction.options.getString("reason") ||
    "No reason provided, but the delay was surely egregious.";

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "{}");

  const raw = fs.readFileSync(dataPath, "utf-8");
  const data: WaitData = raw.length ? JSON.parse(raw) : {};

  if (!data[user.id]) {
    data[user.id] = { count: 0, logs: [] };
  }

  data[user.id].count += 1;
  data[user.id].logs.push({
    reason,
    timestamp: new Date().toISOString(),
  });

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  const count = data[user.id].count;

  let reaction: string;
  if (count === 1) {
    reaction =
      "Their very first infraction. I'm sure it won't become a habit... right?";
  } else if (count < 5) {
    reaction = `That's ${count} now. A concerning trend, but not unsalvageable.`;
  } else if (count < 10) {
    reaction = `That's ${count} delays. I do hope they’re at least fashionably late.`;
  } else {
    reaction = `Logged ${count} times. Shall I begin preparing a statue in their honour?`;
  }

  const embed = new EmbedBuilder()
    .setTitle(`Another Delay Logged`)
    .setColor(0xd38c00)
    .setDescription(
      `**${user.username}** has been recorded for holding up the group.\n\n💬 “${reason}”`,
    )
    .addFields({ name: "Total Times Logged", value: `${count}`, inline: true })
    .setFooter({ text: reaction });

  await interaction.reply({ embeds: [embed] });
}
