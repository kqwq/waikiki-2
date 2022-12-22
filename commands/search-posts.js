import { SlashCommandBuilder } from "discord.js";
import { sendEmbedAboutPost } from "../util/card.js";

export default {
  data: new SlashCommandBuilder()
    .setName("search-posts")
    .setDescription("Search for Khan Academy discussion - for dummies")

    // Content
    .addStringOption((option) =>
      option
        .setName("word-or-phrase")
        .setDescription("Substring to search for (not case sensitive)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const content = interaction.options.getString("word-or-phrase");
    await interaction.deferReply();

    // Prevent SQL injection
    if (
      content.includes("%") ||
      content.includes("'") ||
      content.includes("_")
    ) {
      await interaction.editReply(
        "For security reasons, you can't search for `%`, `'`, or `_` characters. Sorry!"
      );
      return;
    }

    let sql = `SELECT * FROM posts WHERE content LIKE '%${content}%' ORDER BY RANDOM() LIMIT 3`;
    let { rows } = await interaction.client.db.query(sql);
    if (rows.length == 0) return interaction.followUp("No results found.");

    // Send embed
    await sendEmbedAboutPost(interaction, rows, -1, true);
  },
};
