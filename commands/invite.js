import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get an invite link for the bot"),
  async execute(interaction) {
    await interaction.reply(
      "Invite me to your server: https://discord.com/api/oauth2/authorize?client_id=946846829268598815&permissions=117824&scope=bot%20applications.commands"
    );
  },
};
