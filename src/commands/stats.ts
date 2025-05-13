import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
} from "discord.js";
import fs from "fs";
import path from "path";
import { WaitData, WaitLogEntry } from "../types/wait";

const dataDir = path.join(__dirname, "../../data");
const dataPath = path.join(dataDir, "data.json");

export const data = new SlashCommandBuilder()
  .setName("stats")
  .setDescription("Check how many times you’ve made everyone wait");

export async function execute(
  interaction: ChatInputCommandInteraction<CacheType>,
) {
  const user = interaction.user;

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "{}");

  const raw = fs.readFileSync(dataPath, "utf-8");
  const data: WaitData = raw.length ? JSON.parse(raw) : {};

  const userData = data[user.id];
  const count = userData?.count || 0;
  const logs: WaitLogEntry[] = userData?.logs || [];

  if (count === 0) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Right on Time, Sir/Madam`)
          .setDescription(
            `Marvellous! Not a single delay on your record, ${user.username}. I dare say you're the pride of punctuality.`,
          )
          .setColor(0x00cc99)
          .setFooter({ text: "Timeliness is terribly underrated these days." }),
      ],
    });
  }

  const subtitle =
    count >= 10
      ? `That’s becoming quite the collection, wouldn't you say?`
      : `Let’s try to keep it under double digits, shall we?`;

  const embed = new EmbedBuilder()
    .setTitle(`Tardy Report for ${user.username}`)
    .setColor(0xcc4444)
    .setDescription(
      `You've been logged **${count}** time(s) for keeping the group waiting. ${subtitle}`,
    )
    .setFooter({ text: "Every second counts. Or so I’m told." });

  logs
    .slice(-5)
    .reverse()
    .forEach((log, index) => {
      const incidentNumber = count - index;
      embed.addFields({
        name: `Incident #${incidentNumber}`,
        value: `🕒 ${new Date(log.timestamp).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}\n“${log.reason}”`,
      });
    });

  await interaction.reply({ embeds: [embed] });
}
