import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("website")
    .setDescription("Replies with the website link!"),
  async execute(interaction) {
    await interaction.reply("Website under construction");
  },
};
