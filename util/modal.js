import { createProgram, generateKAAS } from "./ka.js";
import logger from "./logger.js";

async function onModalSubmit(interaction) {
  if (interaction.customId !== "publish-modal") return;
  await interaction.deferReply();

  // Get data
  const title = interaction.fields.getTextInputValue("input-title");
  const username = interaction.fields.getTextInputValue("input-username");
  const password = interaction.fields.getTextInputValue("input-password");

  // console.log(title, username, password);

  let kaas = await generateKAAS(username, password);

  logger.log("warn", `kaas: ${kaas}`);

  let code = interaction.client.publishingCode;
  let newProgram = await createProgram(title, code, kaas);
  interaction.client.publishingCode = "[error9001]";

  let baseUrl = "https://www.khanacademy.org";
  logger.log("warn", `newProgram: ${baseUrl}${newProgram.url}`);

  await interaction.editReply(`Published at ${baseUrl}${newProgram.url}`);
}

export { onModalSubmit };
