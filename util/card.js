import { EmbedBuilder } from "@discordjs/builders";
import { getUserProfile } from "./ka.js";

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const shortenKaid = (kaid) => {
  return kaid.slice(0, 4) + "..." + kaid.slice(-4);
};

const shotenContent = (content) => {
  if (content.length > 500) {
    return content.slice(0, 500 - 3) + "[…]";
  } else {
    return content;
  }
};

async function sendEmbedAboutPost(
  interaction,
  posts,
  totalCount,
  isEditInteraction = false
) {
  // Get nicknames from user KAIDs
  for (let post of posts) {
    let userData = await getUserProfile(post.authorKaid);
    post.authorNickname = userData?.nickname || "[error]";
  }

  let desc = "";
  for (let post of posts) {
    desc += `<t:${Math.floor(new Date(post.date) / 1000)}:R> **[${capitalize(
      post.type
    )}](https://khanacademy.org/computer-programming/w/${
      post.programId
    }?qa_expand_key=${post.expandKey}&qa_expand_type=reply) by [${
      post.authorNickname
    }](https://khanacademy.org/profile/${post.authorKaid})** — ${shotenContent(
      post.content.slice(0)
    )}\n`;
  }
  if (totalCount > posts.length)
    desc += `*…and ${(totalCount - posts.length).toLocaleString()} more*`;

  const embed = new EmbedBuilder().setDescription(desc.slice(0, 4090));

  if (isEditInteraction) {
    await interaction.editReply({ embeds: [embed] });
  } else {
    if (!interaction.channel) await interaction.followUp({ embeds: [embed] });
    else await interaction.channel.send({ embeds: [embed] });
  }
}

export { sendEmbedAboutPost };
