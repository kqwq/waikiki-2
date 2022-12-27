import { SlashCommandBuilder } from "discord.js";
import path from "path";
import fs from "fs";
import logger from "../util/logger";

const __dirname = path.resolve();

export default {
  data: new SlashCommandBuilder()
    .setName("reload-command")
    .setDescription("Reloads 1 command")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to reload")
        .setRequired(true)
    ),

  async execute(interaction) {
    let client = interaction.client;
    const commandsPath = path.join(
      __dirname,
      "./commands",
      `${interaction.options.getString("command")}.js`
    );
    try {
      const command = await import(commandsPath).then(
        (command) => command.default
      );
      client.commands.set(command.data.name, command);
    } catch (error) {
      console.log(error);
      logger.error("Could not reload command", error);
      return await interaction.reply(
        `Could not reload ${interaction.options.getString("command")}!`
      );
    }
    await interaction.reply(
      `Reloaded ${interaction.options.getString("command")}!`
    );
  },
};
