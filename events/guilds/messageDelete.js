const {
  InteractionType,
  EmbedBuilder
} = require("discord.js");
const { updateTickets } = require("../../functions/tickets");
const { editProfile, sendLeaderBoard } = require("../../functions/canvasCmd");

module.exports = async (client, message) => {
  let logChannel = client.channels.cache.get(client.config.static.logChannels.global)
  if(!logChannel) {
    return console.log(`[messageDelete] logChannel undefined. No channel found with ID=${client.config.static.logChannels.global}`)
  }

  let fetchedLogs = await message.guild.fetchAuditLogs({
    limit: 10,
    type: 72
  });
  const auditEntry = fetchedLogs.entries.find(a =>
    a.extra.channel.id == message.channel.id
  );
  
  const executor = auditEntry?.executor ?? 'Unknown';

  if(executor.bot) {
    return console.log(`[messageDelete] Deleted by a bot (${executor}) -> Not logging messageDelete.`)
  }
  // console.log("message:",message)

  try {
    logChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Message supprimé")
          .setAuthor({ name: (message.author ? (message.member.nickname ?? message.author.username) : "Cannot resolve username") , iconURL: message.author?.displayAvatarURL() })
          .setThumbnail( (message.author?.displayAvatarURL() ?? "https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png") )
          .setDescription([
            `Supprimé par: **${executor}** ${!!executor ? `(\`${executor.id}\`)` : ""}`,
            `Channel: <#${message.channel.id}>`,
            `Message: \`\`\`${message.content}\`\`\``,
            `Contenait des embeds: ${message.embeds.length != 0 ? `Oui (${message.embeds.length})` : "Non"}`,
          ].join("\n"))
          .setColor("FF0000")
          .setTimestamp()
      ]
    })
  } catch(e) {
    console.log(e)
    error(message)
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