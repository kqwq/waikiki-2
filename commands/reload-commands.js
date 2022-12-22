import { SlashCommandBuilder } from "discord.js";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

export default {
  data: new SlashCommandBuilder()
    .setName("reload-commands")
    .setDescription("Reloads all commands"),

  async execute(interaction) {
    let client = interaction.client;
    client.commands = new Map();
    const commandsPath = path.join(__dirname, "./commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath).then((command) => command.default);
      console.log;
      client.commands.set(command.data.name, command);
    }

    await interaction.reply("Reloaded all commands!");
  },
};
