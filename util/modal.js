async function onModalSubmit(interaction) {
  if (interaction.customId !== "publish-modal") return;
  await interaction.deferReply();

  // Get data
  const title = interaction.fields.getTextInputValue("input-title");
  const username = interaction.fields.getTextInputValue("input-username");
  const password = interaction.fields.getTextInputValue("input-password");

  console.log(title, username, password);

  await interaction.editReply("Published!");
}

export { onModalSubmit };
