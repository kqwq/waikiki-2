import { ActivityType, Events } from "discord.js";
import logger from "../util/logger.js";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    logger.log("info", `Logged in as ${client.user.tag}`);

    setTimeout(() => {
      client.user.setActivity(
        `${client.db.rowCount.toLocaleString()} comments`,
        {
          type: ActivityType.Watching,
        }
      );
    }, 1000 * 5);
  },
};
