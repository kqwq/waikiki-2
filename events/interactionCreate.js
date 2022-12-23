import { Events } from "discord.js";
import { onModalSubmit } from "../util/modal.js";

export default {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isModalSubmit()) {
      await onModalSubmit(interaction);
      return;
    }

    if (interaction.isMessageContextMenuCommand()) {
      const command = interaction.client.contextCommands.get(
        interaction.commandName
      );

      if (!command)
        return console.error(
          `No context command matching ${interaction.commandName} found`
        );

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
      }
    }

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command)
        return console.error(
          `No slash command matching ${interaction.commandName} found`
        );

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
      }
    }
  },
};
