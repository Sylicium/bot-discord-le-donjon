const Discord = require('discord.js');
const {
  EmbedBuilder
} = Discord;

module.exports = async (client, oldState, newState) => {


  //const guild = client.guilds.cache.get('1094318705883762719')
  const guild = (newState.channel ?? oldState.channel).guild
  const channel = guild.channels.cache.get(client.config.static.logChannels.voice)
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

    let temp = [...newState.guild.channels.cache.map(x => x)]
    let le_no_micro_channel = temp.filter(x => {
      return (x.name == newState.channel.name) && (x.type == Discord.ChannelType.GuildText)
    })
    if(le_no_micro_channel) {
      le_no_micro_channel[0].send({
        embeds: [
          new Discord.EmbedBuilder()
            .setAuthor({ name: `➕ ${member.nickname ?? member.username} a rejoint le vocal`, icon_url: member.user.displayAvatarURL() })
            .setColor("00FF00")
        ]
      }).catch(e => {
        console.log("pas envoyé:",e)
      })
      if(newState.member.id == client.config.static.users.seikam) {
        le_no_micro_channel.send({
          content: "https://cdn.discordapp.com/attachments/1164697507805286440/1165021256161169459/0F3DECC.gif"
        }).catch(e => {
          console.log("pas envoyé:",e)
        })
      }
    }
    
  } else if (newState.channelId === null) {
    const embed = new EmbedBuilder()
      .setTitle("Déconnection d'un channel")
      .setDescription(`${member.user} a quitté le salon <#${oldState.channelId}>`)
      .setColor(0xff5555)
      .setTimestamp()

    channel.send({
      embeds: [embed]
    })

    
    let temp = [...newState.guild.channels.cache.map(x => x)]
    let le_no_micro_channel = temp.filter(x => {
      return (x.name == oldState.channel.name) && (x.type == Discord.ChannelType.GuildText)
    })
    if(le_no_micro_channel) {
      le_no_micro_channel[0].send({
        embeds: [
          new Discord.EmbedBuilder()
            .setAuthor({ name: `➖ ${member.nickname ?? member.username} a quitté le vocal`, icon_url: member.user.displayAvatarURL() })
            .setColor("00FF00")
        ]
      }).catch(e => {
        console.log("pas envoyé:",e)
      })
      if(oldState.member.id == client.config.static.users.seikam) {
        le_no_micro_channel.send({
          content: "https://cdn.discordapp.com/attachments/1164697507805286440/1165021256161169459/0F3DECC.gif"
        }).catch(e => {
          console.log("pas envoyé:",e)
        })
      }
    }


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
  } else if (oldState.selfVideo != newState.selfVideo) {
    if (newState.selfVideo) {
      const embed = new EmbedBuilder()
        .setTitle("Début de stream")
        .setDescription(`${member.user} a allumé sa caméra.`)
        .setColor(0x00AA00)
        .setTimestamp()

      channel.send({
        embeds: [embed]
      })
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Fin de stream")
        .setDescription(`${member.user} a coupé sa caméra.`)
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