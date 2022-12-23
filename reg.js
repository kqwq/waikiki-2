import {
  ApplicationCommand,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  REST,
  Routes,
} from "discord.js";
import fs from "node:fs";
import dotenv from "dotenv";
import { CLIENT_ID, MAIN_SERVER_GUILD_ID } from "./constants.js";
dotenv.config();

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  await import(`./commands/${file}`).then((command) => {
    commands.push(command.default.data.toJSON());
  });
}

// Do the same for context commands
const contextCommandFiles = fs
  .readdirSync("./contextCommands")
  .filter((file) => file.endsWith(".js"));

for (const file of contextCommandFiles) {
  await import(`./contextCommands/${file}`).then((command) => {
    commands.push(command.default.data.toJSON());
  });
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, MAIN_SERVER_GUILD_ID),
      { body: [] }
    );

    const data2 = await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
    console.log(`Successfully reloaded ${data2.length} global (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
