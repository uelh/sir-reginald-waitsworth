import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
  User,
} from "discord.js";
import fs from "fs";
import path from "path";
import { WaitData } from "../types/wait";

const dataDir = path.join(__dirname, "../../data");
const dataPath = path.join(dataDir, "data.json");

export const data = new SlashCommandBuilder()
  .setName("waitboard")
  .setDescription("Behold the Hall of Waiters — ranked by delayfulness");

export async function execute(
  interaction: ChatInputCommandInteraction<CacheType>,
) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "{}");

  const raw = fs.readFileSync(dataPath, "utf-8");
  const data: WaitData = raw.length ? JSON.parse(raw) : {};

  const entries = Object.entries(data)
    .filter(([_, val]) => val.count > 0)
    .sort((a, b) => b[1].count - a[1].count);

  if (entries.length === 0) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("The Waitboard")
          .setDescription(
            "Not a single delay on record. Astounding! Perhaps the apocalypse *has* arrived.",
          )
          .setColor(0x00cc99)
          .setFooter({
            text: "Everyone’s been perfectly punctual. I must be dreaming.",
          }),
      ],
    });
  }

  const embed = new EmbedBuilder()
    .setTitle("🏆 The Waitboard")
    .setColor(0xffcc00)
    .setDescription(
      `Here lie the names of those most proficient in the art of making others wait.`,
    )
    .setFooter({ text: "Punctuality is optional. Apparently." });

  const topN = 10;

  for (let i = 0; i < Math.min(entries.length, topN); i++) {
    const [userId, info] = entries[i];
    let user: User | null = null;

    try {
      user = await interaction.client.users.fetch(userId);
    } catch {
      user = null;
    }

    const name = user ? user.username : `User ${userId}`;
    const rankMedal =
      i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;

    embed.addFields({
      name: `${rankMedal} ${name}`,
      value: `${info.count} recorded delay${info.count === 1 ? "" : "s"}`,
      inline: false,
    });
  }

  await interaction.reply({ embeds: [embed] });
}
