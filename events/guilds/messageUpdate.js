const {
  InteractionType,
  EmbedBuilder
} = require("discord.js");
const { updateTickets } = require("../../functions/tickets");
const { editProfile, sendLeaderBoard } = require("../../functions/canvasCmd");

module.exports = async (client, oldMessage, newMessage) => {


  if(newMessage.author.bot) return;
  if(!newMessage.guild) return;

  let logChannel = client.channels.cache.get(client.config.static.logChannels.global)
  if(!logChannel) {
    return console.log(`[messageUpdate] logChannel undefined. No channel found with ID=${client.config.static.logChannels.global}`)
  }

  console.log("oldMessage:",oldMessage)
  console.log("newMessage:",newMessage)

  try {

    if(oldMessage?.content === newMessage?.content) return;

    let fileList = oldMessage.attachments.map(x => {
      return `[${x.name}](${x.url})`
    }).join(", ")

    console.log("fileList:",fileList)

    logChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Message modifié")
          .setAuthor({ name: (newMessage.author ? (newMessage.member.nickname ?? newMessage.author.username) : "Cannot resolve username") , iconURL: newMessage.author?.displayAvatarURL() })
          .setThumbnail( (newMessage.author?.displayAvatarURL() ?? "https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png") )
          .setDescription([
            `Channel: <#${newMessage.channel.id}>`,
            `Ancien message: \`\`\`${oldMessage.content}\`\`\` `,
            `Nouveau message: \`\`\`${newMessage.content}\`\`\` `,
            `Contient des embeds: ${newMessage.embeds.length != 0 ? `Oui (${newMessage.embeds.length})` : "Non"}`,
            `Contenait des fichiers: ${oldMessage.attachments.map(x => x) != 0 ? `Oui (${fileList})` : "Non"}`,
            `${(oldMessage.content == null && oldMessage.author == null) ? `\n:x: Erreur de chargement. L'ancien message n'était présent dans le cache, il est possible que certaines informations ne soient pas valide.` :""}`
          ].join("\n"))
          .setColor("0F2371")
          .setTimestamp()
      ]
    })
  } catch(e) {
    console.log(e)
    error(newMessage)
  }




}


function error(message) {
    message.channel.send({
    embeds: [
      new EmbedBuilder()
      .setDescription("Une erreur est survenue, si le problème persiste contactez un staff!")
      .setColor(0xFF0000)
    ]
  });
}