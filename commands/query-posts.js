import {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import sqlstring from "sqlstring";
import { sendEmbedAboutPost } from "../util/card.js";
const { escape } = sqlstring;

const convertStringToDate = (input) => {
  if (isNaN(input)) return new Date(input);
  else return new Date(parseInt(input) * 1000);
  return new Date();
};

export default {
  data: new SlashCommandBuilder()
    .setName("query-posts")
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
    .addStringOption((option) =>
      option
        .setName("before")
        .setDescription(
          "Parsed as `new Date(before)` e.g. 1671723951, Sep 5 2020"
        )
    )

    // After date
    .addStringOption((option) =>
      option
        .setName("after")
        .setDescription(
          "Parsed as `new Date(after)` e.g. 1671723951, Sep 5 2020"
        )
    )

    //Sort by
    .addStringOption((option) =>
      option
        .setName("sort_by")
        .setDescription("Sort by")
        .addChoices(
          { name: "Date (Newest)", value: "date-old" },
          { name: "Date (Oldest)", value: "date-new" },
          { name: "Length (Shortest)", value: "length-short" },
          { name: "Length (Longest)", value: "length-long" },
          { name: "Upvotes (Most)", value: "upvotes-most" },
          { name: "Replies (Most)", value: "replies-most" },
          { name: "Randomized", value: "random" }
        )
    )

    // Output format
    .addStringOption((option) =>
      option
        .setName("output_format")
        .setDescription("Output format")
        .addChoices(
          { name: "Simple text", value: "simple" },
          { name: "JSON file (.json)", value: "json" },
          { name: "CSV file (.csv)", value: "csv" }
        )
    ),
  async execute(interaction) {
    const content = interaction.options.getString("contains");
    const caseSensitive = interaction.options.getBoolean("case_sensitive");
    const type = interaction.options.getString("type");
    const authorKAID = interaction.options.getString("author_kaid");
    const programID = interaction.options.getString("program_id");
    const before = interaction.options.getString("before");
    const after = interaction.options.getString("after");
    const sortBy = interaction.options.getString("sort_by");
    const outputFormat =
      interaction.options.getString("output_format") || "simple";

    // Prevent SQL injection
    if (
      content.includes("%") ||
      content.includes("'") ||
      content.includes("_")
    ) {
      await interaction.reply(
        "Due to security reasons, you can't search for `%`, `'`, or `_` characters. Sorry!"
      );
      return;
    }

    // Create full SQL query and limit to 10 results
    let sql = `SELECT * FROM posts WHERE content LIKE ${escape(
      "%" + content.replace(/\%/g, "\\%") + "%"
    )}`;

    // Add optional filters
    // if (caseSensitive) sql += " AND case_sensitive = 1";
    if (type) sql += ` AND type = ${escape(type)}`;
    if (authorKAID) sql += ` AND authorKaid = ${escape(authorKAID)}`;
    if (programID) sql += ` AND programId = ${escape(programID)}`;
    if (before)
      sql += ` AND date < '${convertStringToDate(before).toISOString()}'`;
    if (after)
      sql += ` AND date > '${convertStringToDate(after).toISOString()}'`;

    // Add optional sorting
    if (sortBy) {
      switch (sortBy) {
        case "date-old":
          sql += " ORDER BY date DESC";
          break;
        case "date-new":
          sql += " ORDER BY date ASC";
          break;
        case "length-short":
          // Order by length of content
          sql += " ORDER BY LENGTH(content) ASC";
          break;
        case "length-long":
          // Order by length of content
          sql += " ORDER BY LENGTH(content) DESC";
          break;
        case "upvotes-most":
          sql += " ORDER BY upvotes DESC";
          break;
        case "replies-most":
          sql += " ORDER BY replyCount DESC";
          break;
        case "random":
          sql += " ORDER BY RANDOM()";
          break;
      }
    }

    // Limit to 100 results
    sql += " LIMIT 100";

    // Waiting
    await interaction.reply(`Querying \`${sql}\`...`);

    // Send SQL query to sqlite3 database
    const db = interaction.client.db;
    let { rows } = await db.query(sql);
    if (rows.length == 0) return interaction.followUp("No results found.");

    // Count number of results
    let countSql = sql.replace("SELECT *", "SELECT COUNT(*)");
    let response = await db.query(countSql);
    let totalResults = response.rows[0]["COUNT(*)"];

    // Calculate date range
    let earliest = new Date(rows[0].date);
    let latest = new Date(rows[0].date);
    rows.forEach((row) => {
      let date = new Date(row.date);
      if (date < earliest) earliest = date;
      if (date > latest) latest = date;
    });
    let dateRange = `<t:${Math.floor(earliest / 1000)}:R> - <t:${Math.floor(
      latest / 1000
    )}:R>`;

    // Send embed response
    let embed = new EmbedBuilder()
      .setTitle(`Discussion post query`)
      .setDescription(`\`${sql}\``)
      .setColor("0x078FFE");
    embed.addFields({ name: "Count", value: `${totalResults}` });
    embed.addFields({ name: "Date range", value: dateRange });
    embed.addFields({
      name: "Percentage",
      value: `${((totalResults / db.rowCount) * 100).toPrecision(3)}%`,
    });
    embed.addFields({ name: "Output format", value: outputFormat });

    // Send embed (all formats)
    await interaction.editReply({ embeds: [embed], content: "" });

    // Send simple embed
    if (outputFormat === "simple") {
      await sendEmbedAboutPost(interaction, rows.slice(0, 10));
    }

    // Send JSON file (JSON format)
    if (outputFormat === "json") {
      let json = JSON.stringify(rows, null, 2);
      let file = new AttachmentBuilder()
        .setName("ka-posts.json")
        .setFile(Buffer.from(json));
      await interaction.editReply({ files: [file] });
    }

    // Send CSV file (CSV format)
    if (outputFormat === "csv") {
      let csv =
        "id,parentId,programId,type,content,authorKaid,date,answerCount,replyCount,upvotes,lowQualityScore,flags,key";
      rows.forEach((row) => {
        csv += `\n${row.id},${row.parentId},${row.programId},${
          row.type
        },"${row.content.replaceAll(`"`, `""`)}",${row.authorKaid},${
          row.date
        },${row.answerCount},${row.replyCount},${row.upvotes},${
          row.lowQualityScore
        },${row.flags},${row.key}`;
      });
      let file = new AttachmentBuilder()
        .setName("ka-posts.csv")
        .setFile(Buffer.from(csv));
      await interaction.editReply({ files: [file] });
    }
  },
};
