import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
} from "discord.js";
import fs from "fs";
import path from "path";

const dataDir = path.join(__dirname, "../../data");
const dataPath = path.join(dataDir, "data.json");

export const data = new SlashCommandBuilder()
  .setName("resetwaits")
  .setDescription("Wipe all wait logs. A fresh start... for everyone.");

export async function execute(
  interaction: ChatInputCommandInteraction<CacheType>,
) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  fs.writeFileSync(dataPath, "{}");

  const embed = new EmbedBuilder()
    .setTitle("⏳ The Great Reset")
    .setColor(0x3366cc)
    .setDescription(
      `All wait logs have been cleared.\n\nA bold decision, ${interaction.user.username} — very generous.\nLet us hope our esteemed members make better use of this *second chance*.`,
    )
    .setFooter({ text: "Forgive, perhaps. Forget? Not likely." });

  await interaction.reply({ embeds: [embed] });
}
