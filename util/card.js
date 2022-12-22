import { EmbedBuilder } from "@discordjs/builders";

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const shortenKaid = (kaid) => {
  return kaid.slice(0, 4) + "..." + kaid.slice(-4);
};

const shotenContent = (content) => {
  if (content.length > 400) {
    return content.slice(0, 397) + "[…]";
  } else {
    return content;
  }
};

async function sendEmbedAboutPost(interaction, posts) {
  let desc = "";
  for (let post of posts) {
    desc += `<t:${Math.floor(new Date(post.date) / 1000)}:R> **${
      post.type
    }** by **${shortenKaid(post.authorKaid)}**: ${shotenContent(
      post.content.slice(0)
    )}\n`;
  }

  const embed = new EmbedBuilder().setDescription(desc);

  await interaction.channel.send({ embeds: [embed] });
}

export { sendEmbedAboutPost };
