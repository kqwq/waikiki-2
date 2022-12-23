import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ai-code-pjs")
    .setDescription("Uses AI to generate PJS code for Khan Academy")
    .addStringOption((option) =>
      option
        .setName("prompt-specific")
        .setDescription("Simple object e.g. 10 blue triangles")
        .setRequired(true)
    ),

  async execute(interaction) {
    interaction.deferReply();
    let innerPrompt = interaction.options.getString("prompt-specific");
    if (!innerPrompt) return interaction.editReply("No prompt specified");
    let fullPrompt = `/* Khan Academy code for ${innerPrompt} */`;
    let body = {
      model: "code-davinci-002",
      prompt: fullPrompt,
      temperature: 0.05,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0.05,
      presence_penalty: 0.6,
    };
    let openai = interaction.client.openai;
    let response = await openai.createCompletion(body);
    let code = response.data.choices[0].text;
    if (code.length > 2000) {
      let file = new AttachmentBuilder()
        .setName("code.js")
        .setFile(Buffer.from(code));

      await interaction.editReply({ files: [file] });
    } else {
      await interaction.editReply(`\`\`\`js\n${code}\`\`\``);
    }
  },
};
