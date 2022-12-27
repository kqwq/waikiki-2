// Imports
import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import fs from "node:fs";
import sqlite3 from "sqlite3";
import { OPENAI_ORG, PATH_TO_DB } from "./constants.js";
import { Configuration, OpenAIApi } from "openai";

// Config
dotenv.config();
const __dirname = path.resolve();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands
client.commands = new Map();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(filePath).then((command) => command.default);
  client.commands.set(command.data.name, command);
}

// Load context commands
client.contextCommands = new Map();
const contextCommandsPath = path.join(__dirname, "contextCommands");
const contextCommandFiles = fs
  .readdirSync(contextCommandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of contextCommandFiles) {
  const filePath = path.join(contextCommandsPath, file);
  const command = await import(filePath).then((command) => command.default);
  client.contextCommands.set(command.data.name, command);
}

// Handle events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = await import(filePath).then((event) => event.default);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Connect to sqlite3 database
client.db = new sqlite3.Database(PATH_TO_DB, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the posts database.");
});
client.db.rowCount = 1; // Prevent undefined error
client.db.query = function (sql, params = []) {
  // Hack to make sqlite3 work with async/await
  var that = this;
  return new Promise(function (resolve, reject) {
    that.all(sql, params, function (error, rows) {
      if (error) reject(error);
      else resolve({ rows: rows });
    });
  });
};
client.db.all("SELECT COUNT(*) FROM posts", [], (err, rows) => {
  // Count number of rows in client.db total and store that as client.db.totalRows
  if (err) throw err;
  let count = rows[0]["COUNT(*)"];
  client.db.rowCount = count;
});

// Configure OpenAI
const configuration = new Configuration({
  organization: OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});
client.openai = new OpenAIApi(configuration);

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
