import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

let msg = `

Find KAID by nickname: https://kasearch.learnerpages.com/ 
Find KAID by nick/username Use the \`\\user\` command on Willard's Bot
Find profile by KAID: Open the URL https://khanacademy.org/profile/KAID_HERE
Find program by title: Use the \`\\program\` command on Willard's Bot
Find program by code contents: Ask Willard
Find web content by search term: Use the \`\\search\` command on Willard's Bot
Find comment by Y: Use the \`/query-posts\` command on Waikiki Bot
Deleted programs: https://github.com/MatthiasPortzel/ka-hearth/wiki
`;

export default {
  data: new SlashCommandBuilder()
    .setName("find-x-by-y")
    .setDescription(
      "Lists ways to find specific data relating to Khan Academy"
    ),
  async execute(interaction) {
    let embed = new EmbedBuilder()
      .setTitle("Find X by Y")
      .setDescription(msg)
      .setColor("#16a085");

    await interaction.reply({ embeds: [embed] });
  },
};
