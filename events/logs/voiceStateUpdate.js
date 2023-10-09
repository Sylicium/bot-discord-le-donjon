const {
  EmbedBuilder
} = require('discord.js');

module.exports = async (client, oldState, newState) => {
  const guild = client.guilds.cache.get('1094318705883762719')
  const channel = guild.channels.cache.get('1094318710430380039')
  const member = guild.members.cache.get(oldState.id);

  if (oldState.channelId === null) {
    const embed = new EmbedBuilder()
      .setTitle("Connection au channel")
      .setDescription(`${member.user} a rejoint le salon <#${newState.channelId}>`)
      .setColor(0x55FF55)
      .setTimestamp()

    channel.send({
      embeds: [embed]
    })
  } else if (newState.channelId === null) {
    const embed = new EmbedBuilder()
      .setTitle("Déconnection d'un channel")
      .setDescription(`${member.user} a quitté le salon <#${oldState.channelId}>`)
      .setColor(0xff5555)
      .setTimestamp()

    channel.send({
      embeds: [embed]
    })
  } else if (oldState.streaming != newState.streaming) {
    if (newState.streaming) {
      const embed = new EmbedBuilder()
        .setTitle("Début de stream")
        .setDescription(`${member.user} a commencé un stream.`)
        .setColor(0x00AA00)
        .setTimestamp()

      channel.send({
        embeds: [embed]
      })
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Fin de stream")
        .setDescription(`${member.user} a arrêté son stream.`)
        .setColor(0xAA0000)
        .setTimestamp()

      channel.send({
        embeds: [embed]
      })
    }
  } else if (oldState.channelId != newState.channelId) {
    const embed = new EmbedBuilder()
      .setTitle("Migration de channels")
      .setDescription(`${member.user} a quitté le salon <#${oldState.channelId}> pour rejoindre <#${newState.channelId}>`)
      .setColor(0xFFAA00)
      .setTimestamp()

    channel.send({
      embeds: [embed]
    })
  }
}