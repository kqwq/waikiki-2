import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ai-codex")
    .setDescription("Uses AI to generate any code")
    .addStringOption((option) =>
      option
        .setName("full-prompt")
        .setDescription("Specify the full prompt for the AI")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName("temperature").setDescription("The temperature of the AI")
    ),

  async execute(interaction) {
    interaction.deferReply();
    let prompt = interaction.options.getString("full-prompt");
    let temp = interaction.options.getNumber("temperature") || 0.0;
    let body = {
      model: "code-davinci-002",
      prompt: prompt,
      temperature: temp,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0.05,
      presence_penalty: 0,
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
      await interaction.editReply(`\`\`\`${code}\`\`\``);
    }
  },
};
