import {
  ApplicationCommandOptionWithChoicesAndAutocompleteMixin,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("find")
    .setDescription("Search for posts")

    // Content
    .addStringOption((option) =>
      option
        .setName("contains")
        .setDescription("Substring to search for")
        .setRequired(true)
    )

    // Case sensitive
    .addBooleanOption((option) =>
      option
        .setName("case_sensitive")
        .setDescription(
          "NOT IMPLEMENTED Case sensitive search for `contains` (default: false)"
        )
    )

    // Discussion type
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Filter by discussion type")
        .addChoices(
          { name: "Question", value: "question" },
          { name: "Tips & Thanks", value: "comment" },
          { name: "Answer", value: "answer" },
          { name: "Reply", value: "reply" }
        )
    )

    // AuthorKAID
    .addStringOption((option) =>
      option
        .setName("author_kaid")
        .setDescription("Filter by KAID (e.g. kaid_79492645558798574591143)")
    )

    // Program ID
    .addStringOption((option) =>
      option
        .setName("program_id")
        .setDescription("Filter by program ID (e.g. 5647155001376768)")
    )

    // Before date
    .addNumberOption((option) =>
      option
        .setName("before")
        .setDescription("Filter by before UNIX timestamp (e.g. 1671723951)")
    )

    // After date
    .addNumberOption((option) =>
      option
        .setName("after")
        .setDescription("Filter by after UNIX timestamp (e.g. 1671723951)")
    ),

  async execute(interaction) {
    const content = interaction.options.getString("contains");
    const caseSensitive = interaction.options.getBoolean("case_sensitive");
    const type = interaction.options.getString("type");
    const authorKAID = interaction.options.getString("author_kaid");
    const programID = interaction.options.getString("program_id");
    const before = interaction.options.getNumber("before");
    const after = interaction.options.getNumber("after");

    // Create full SQL query and limit to 10 results
    let sql = `SELECT * FROM posts WHERE content LIKE '%${content}%' LIMIT 10`;

    // Add optional parameters
    // if (caseSensitive) sql += " AND case_sensitive = 1";
    if (type) sql += ` AND type = '${type}'`;
    if (authorKAID) sql += ` AND authorKaid = '${authorKAID}'`;
    if (programID) sql += ` AND programId = ${programID}`;
    if (before) sql += ` AND date < ${before}`;
    if (after) sql += ` AND date > ${after}`;

    await interaction.reply(`Sending \`${sql}\` to database...`);
  },
};
