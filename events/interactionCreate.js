import { Events } from "discord.js";
import { OWNER_USER_ID } from "../constants.js";
import logger from "../util/logger.js";
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
        // Execute the command
        await command.execute(interaction);
      } catch (error) {
        logger.error(error);
      }
    }

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      // If the command was executed by another user, log it
      if (interaction.user.id !== OWNER_USER_ID) {
        logger.log(
          "info",
          `${interaction.user.tag} executed ${
            interaction.commandName
          } with the options: ${interaction.options.data
            .map((option) => `${option.name}: ${option.value}`)
            .join(", ")}`
        );
      }

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
