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
  .setName("unwait")
  .setDescription("Undo the most recent wait log for a user.")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The lucky individual receiving a pardon")
      .setRequired(true),
  );

export async function execute(
  interaction: ChatInputCommandInteraction<CacheType>,
) {
  const user = interaction.options.getUser("user", true);

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "{}");

  const raw = fs.readFileSync(dataPath, "utf-8");
  const data: WaitData = raw.length ? JSON.parse(raw) : {};

  if (!data[user.id] || data[user.id].count === 0) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("No Log Found")
          .setDescription(
            `Ah... it appears **${user.username}** has no recorded delays. Clean as a whistle!`,
          )
          .setColor(0x00cc99)
          .setFooter({ text: "A rare occurrence. Let’s keep it that way." }),
      ],
      ephemeral: true,
    });
  }

  data[user.id].count -= 1;
  const removed = data[user.id].logs.pop();

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  const embed = new EmbedBuilder()
    .setTitle("Log Removed")
    .setColor(0x6699cc)
    .setDescription(
      `One delay has been removed from **${user.username}**’s record.`,
    )
    .addFields(
      {
        name: "Previous Log Removed",
        value: `“${removed?.reason || "Unknown"}”`,
        inline: false,
      },
      {
        name: "Remaining Logged Delays",
        value: `${data[user.id].count}`,
        inline: true,
      },
    )
    .setFooter({
      text: "Very well, one strike forgiven. Let us hope it was deserved.",
    });

  await interaction.reply({ embeds: [embed] });
}
