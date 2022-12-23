import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";

export default {
  data: new ContextMenuCommandBuilder()
    .setName("Publish to KA")
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    const msg = interaction.targetMember;

    // Popup modal with a form for the title
    const modal = new ModalBuilder()
      .setCustomId("publish-modal")
      .setTitle("Publish to Khan Academy");

    const titleInput = new TextInputBuilder()
      .setCustomId("input-title")
      .setLabel("Title")
      .setStyle(TextInputStyle.Short);
    const usernameInput = new TextInputBuilder()
      .setCustomId("input-username")
      .setLabel("KA Username")
      .setStyle(TextInputStyle.Short);
    const passwordInput = new TextInputBuilder()
      .setCustomId("input-password")
      .setLabel("KA Password")
      .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
    const secondActionRow = new ActionRowBuilder().addComponents(usernameInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(passwordInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
    await interaction.showModal(modal);
  },
};
