const Discord = require('discord.js');
const {
  EmbedBuilder
} = Discord;

module.exports = async (client, oldState, newState) => {


  //const guild = client.guilds.cache.get('1094318705883762719')
  const guild = (newState.channel ?? oldState.channel).guild
  const channel = guild.channels.cache.get(client.config.static.logChannels.voice)
  const member = oldState.member ?? newState.member

  // console.log("member.displayAvatarURL",member.displayAvatarURL())
  // console.log("member.user.displayAvatarURL",member.user.displayAvatarURL())

  if (oldState.channelId === null) {
    const embed = new EmbedBuilder()
      .setTitle("Connection au channel")
      .setDescription(`${member.user} a rejoint le salon <#${newState.channelId}>`)
      .setColor(0x55FF55)
      .setTimestamp()

    channel.send({
      embeds: [embed]
    }).catch(e => {
      console.log(e)
    })

    let temp = [...newState.guild.channels.cache.map(x => x)]
    let le_no_micro_channel = temp.filter(x => {
      return (x.type == Discord.ChannelType.GuildText)
      && (
        (x.name == newState.channel.name)
        || (x.name == newState.channel.name.split(" ").join("-"))
        || (x.name == newState.channel.name.split(" ").join(""))
      )
    })
    if(le_no_micro_channel.length > 0) {
      le_no_micro_channel[0].send({
        embeds: [
          new Discord.EmbedBuilder()
            .setAuthor({ name: `${member.nickname ?? member.user.username} est arrivé !`, iconURL: member.displayAvatarURL() })
            .setColor("00FF00")
        ]
      }).catch(e => {
        console.log("pas envoyé:",e)
      })
      if(newState.member.id == client.config.static.users.seikam) {
        le_no_micro_channel[0].send({
          content: (
            newState?.channel?.parent?.id == client.config.static.categories.regression ?
            "https://tenor.com/view/lick-c-at-cute-tongue-out-gif-15308597"
            : "https://cdn.discordapp.com/attachments/1164697507805286440/1165021256161169459/0F3DECC.gif"
          )
        }).catch(e => {
          console.log("pas envoyé:",e)
        })
      }
    } else {
      console.log("No no-mic channel found for voiceUpdate join.")
    }
    
  } else if (newState.channelId === null) {
    const embed = new EmbedBuilder()
      .setTitle("Déconnection d'un channel")
      .setDescription(`${member.user} a quitté le salon <#${oldState.channelId}>`)
      .setColor(0xff5555)
      .setTimestamp()

    channel.send({
      embeds: [embed]
    }).catch(e => {
      console.log(e)
    })

    
    let temp = [...newState.guild.channels.cache.map(x => x)]
    let le_no_micro_channel = temp.filter(x => {
      return (x.type == Discord.ChannelType.GuildText)
      && (
        (x.name == oldState.channel.name)
        || (x.name == oldState.channel.name.split(" ").join("-"))
        || (x.name == oldState.channel.name.split(" ").join(""))
      )
    })
    if(le_no_micro_channel.length > 0) {
      le_no_micro_channel[0].send({
        embeds: [
          new Discord.EmbedBuilder()
            .setAuthor({ name: `${member.nickname ?? member.user.username} est parti ..`, iconURL: member.displayAvatarURL() })
            .setColor("FF0000")
        ]
      }).catch(e => {
        console.log("pas envoyé:",e)
      })
      if(oldState.member.id == client.config.static.users.seikam) {
        le_no_micro_channel[0].send({
          content: (
            newState?.channel?.parent?.id == client.config.static.categories.regression ?
            "https://tenor.com/view/diggah-tunnah-lion-king-dig-a-tunnel-meerkat-what-was-that-gif-27707671"
            : "https://cdn.discordapp.com/attachments/1164697507805286440/1165021256161169459/0F3DECC.gif"
          )
        }).catch(e => {
          console.log("pas envoyé:",e)
        })
      }
    } else {
      console.log("No no-mic channel found for voiceUpdate join.")
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