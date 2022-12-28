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
};

export default {
  data: new SlashCommandBuilder()
    .setName("query-posts")
    .setDescription("Search for Khan Academy discussion posts")

    // Content
    .addStringOption((option) =>
      option
        .setName("contains")
        .setDescription(
          "Substring to search for. If left blank, returns all posts"
        )
    )

    // Case sensitive
    .addBooleanOption((option) =>
      option
        .setName("case_sensitive")
        .setDescription("NOT IMPLEMENTED Case sensitive search for `contains`")
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
          { name: "Date (Newest) - Default", value: "date-new" },
          { name: "Date (Oldest)", value: "date-old" },
          { name: "Length (Shortest)", value: "length-short" },
          { name: "Length (Longest)", value: "length-long" },
          { name: "Upvotes (Most)", value: "upvotes-most" },
          { name: "Replies (Most)", value: "replies-most" },
          { name: "Randomized", value: "random" },
          { name: "Position on Top List", value: "position" }
        )
    )

    // Output format
    .addStringOption((option) =>
      option
        .setName("output_format")
        .setDescription("Output format")
        .addChoices(
          { name: "Simple text", value: "simple" },
          { name: "JSON (simple)", value: "json-reduced" },
          {
            name: "JSON",
            value: "json",
          },
          { name: "CSV", value: "csv" },
          { name: "None", value: "none" }
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
    const sortBy = interaction.options.getString("sort_by") || "date-new";
    const outputFormat =
      interaction.options.getString("output_format") || "simple";

    // Prevent SQL injection
    if (
      content &&
      (content.includes("%") || content.includes("'") || content.includes("_"))
    ) {
      await interaction.reply(
        "For security reasons, you can't search for `%`, `'`, or `_` characters. Sorry!"
      );
      return;
    }

    // Create full SQL query
    let sql = `SELECT * FROM posts`;

    let sqlFilters = [];

    // Add optional filters
    if (content) sqlFilters.push(`content LIKE ${escape("%" + content + "%")}`);
    // if (caseSensitive) sql += " AND case_sensitive = 1";
    if (type) sqlFilters.push(`type = ${escape(type)}`);
    if (authorKAID) sqlFilters.push(`authorKaid = ${escape(authorKAID)}`);
    if (programID) sqlFilters.push(`programId = ${escape(programID)}`);
    if (before)
      sqlFilters.push(`date < '${convertStringToDate(before).toISOString()}'`);
    if (after)
      sqlFilters.push(`date > '${convertStringToDate(after).toISOString()}'`);
    sql += sqlFilters.length > 0 ? ` WHERE ${sqlFilters.join(" AND ")}` : ""; // Thanks copilot
    let sqlWithFiltersOnly = "" + sql;

    // Add optional sorting
    if (sortBy) {
      switch (sortBy) {
        case "date-old":
          sql += " ORDER BY date ASC";
          break;
        case "date-new":
          sql += " ORDER BY date DESC";
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
        case "position":
          break;
        default:
          break;
      }
    }

    // Limit to 100 or 5 results, depending on output format
    if (outputFormat == "none") sql += " LIMIT 1";
    else if (outputFormat == "simple") sql += " LIMIT 5";
    else sql += " LIMIT 100";

    // Waiting
    await interaction.reply(`Querying \`${sql}\`...`);

    // Send SQL query to sqlite3 database
    const db = interaction.client.db;
    let { rows } = await db.query(sql);
    if (rows.length == 0) return interaction.followUp("No results found.");

    // Count number of results
    let countSql = sqlWithFiltersOnly.replace("SELECT *", "SELECT COUNT(*)");
    let response = await db.query(countSql);
    let totalResults = response.rows[0]["COUNT(*)"];

    // Calculate date range
    let earliestSql = sqlWithFiltersOnly + " ORDER BY date ASC LIMIT 1";
    let latestSql = sqlWithFiltersOnly + " ORDER BY date DESC LIMIT 1";
    let res = await db.query(earliestSql);
    let earliest = new Date(res.rows[0].date);
    res = await db.query(latestSql);
    let latest = new Date(res.rows[0].date);
    let dateRange = `<t:${Math.floor(earliest / 1000)}:R> - <t:${Math.floor(
      latest / 1000
    )}:R>`;

    // Send embed response
    let embed = new EmbedBuilder()
      .setTitle(`Discussion post query`)
      .setDescription(`\`${sql}\``)
      .setColor("0x078FFE");
    embed.addFields({
      name: "Count",
      value: `${totalResults.toLocaleString()}`,
    });
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
      // Send first 5 results
      await sendEmbedAboutPost(interaction, rows.slice(0, 5), totalResults);
    }

    // Send JSON file (JSON format)
    if (outputFormat === "json") {
      let json = JSON.stringify(rows, null, 2);
      let file = new AttachmentBuilder()
        .setName("ka-posts.json")
        .setFile(Buffer.from(json));
      await interaction.editReply({ files: [file] });
    }

    // Send JSON reduced file (JSON format)
    if (outputFormat === "json-reduced") {
      let rowsReduced = rows.map((row) => {
        let newRow = {
          programId: row.programId,
          type: row.type,
          content: row.content,
          authorKaid: row.authorKaid,
          date: row.date,
          expandKey: row.expandKey,
        };
        return newRow;
      });

      let json = JSON.stringify(rowsReduced, null, 2);
      let file = new AttachmentBuilder()
        .setName("ka-posts-reduced.json")
        .setFile(Buffer.from(json));
      await interaction.editReply({ files: [file] });
    }

    // Send CSV file (CSV format)
    if (outputFormat === "csv") {
      let csv =
        "id,parentId,programId,type,content,authorKaid,date,answerCount,replyCount,upvotes,lowQualityScore,key,expandKey";
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
