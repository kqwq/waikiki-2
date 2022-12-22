import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("search-posts")
    .setDescription("Search for posts"),
  async execute(interaction) {
    await interaction.reply("find-simple");
  },
};
