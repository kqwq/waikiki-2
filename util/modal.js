import { createProgram, generateKAAS } from "./ka.js";

async function onModalSubmit(interaction) {
  if (interaction.customId !== "publish-modal") return;
  await interaction.deferReply();

  // Get data
  const title = interaction.fields.getTextInputValue("input-title");
  const username = interaction.fields.getTextInputValue("input-username");
  const password = interaction.fields.getTextInputValue("input-password");

  console.log(title, username, password);

  let kaas = await generateKAAS(username, password);

  console.log("kaas", kaas);

  let code = interaction.client.publishingCode;
  let newProgram = await createProgram(title, code, kaas);
  interaction.client.publishingCode = "[error9001]";

  console.log("newProgram", newProgram);

  let baseUrl = "https://www.khanacademy.org";
  await interaction.editReply(`Published at ${baseUrl}${newProgram.url}`);
}

export { onModalSubmit };
