const { EmbedBuilder, Embed } = require('discord.js');

module.exports = async (client, member) => {
  const embed = new EmbedBuilder()
    .setColor('Green')
    .setDescription(`**Vient de rejoindre le serveur.**`)
    .setTimestamp()

  let logChannel = client.channels.cache.get(client.config.static.logChannels.join_leave)
  if(!logChannel) {
    return console.log(`[guildMemberAdd] logChannel undefined. No channel found with ID=${client.config.static.logChannels.join_leave}`)
  }

  logChannel.send({
    embeds: [
      new EmbedBuilder()  
      .setColor("00FF00")
      .setAuthor({ name: member.nickname ?? member.user.username, iconURL: member.displayAvatarURL() })
      .setDescription([
        `Bienvenue à <@${member.id}> !!!`
      ].join("\n"))
      .setThumbnail(member.displayAvatarURL())
      .setTimestamp()
    ]
  })

}