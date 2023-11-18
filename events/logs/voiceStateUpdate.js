const Discord = require('discord.js');
const {
  EmbedBuilder
} = Discord;

module.exports = async (client, oldState, newState) => {


  //const guild = client.guilds.cache.get('1094318705883762719')
  const guild = (newState.channel ?? oldState.channel).guild
  const channel = client.channels.cache.get(client.config.static.logChannels.voice)
  const member = oldState.member ?? newState.member

  // console.log("member.displayAvatarURL",member.displayAvatarURL())
  // console.log("member.user.displayAvatarURL",member.user.displayAvatarURL())
  

  let all_channels_with_no_mic = [
    {
      name: "Bar",
      voiceID: "1161066145453969448",
      noMicroID: "1163904727768109056",
      roleID: "1161065670138662963"
    },
    {
      name: "Cocoon",
      voiceID: "1165025400376795316",
      noMicroID: "1165024738146529370",
      roleID: "1165024794920624198"
    },
    {
      name: "Chambre noire",
      voiceID: "1161068132484526081",
      noMicroID: "1164117124873207818",
      roleID: "1161065752170868747"
    },
    {
      name: "duo",
      voiceID: "1161066757881069568",
      noMicroID: "1164726981976412191",
      roleID: "1161065722022199437"
    }
  ]

  let specialNickname_list = [
    { id: "526528898876440608", name: "Le souffre douleur d'Angelyne" },
    { id: "233322709604368385", name: "Déesse Emy" },
    { id: "904401609939886100", name: "The Mother of Dragonjons" },
    { id: "770334301609787392", name: "Oh ! Une dév" },
    { id: "467333274314997760", name: "Le diktateur" },
    { id: "575402346591420447", name: "La salope du diktateur" },
    { id: "959198467224387584", name: "La soubrette de Seikam" },
    { id: "300399893611151361", name: "Le Jaybécois" },
    { id: "964474149793828865", name: "Un black" },
    { id: "262306247628423168", name: "J'aime les elfes, car j'en suis un" },
    { id: "411916947773587456", name: "Un bot inférieur à moi" },
    { id: "461898434346221568", name: "Le chragon d'Emy" },
    { id: "718015664975249438", name: "Je suis lesbienne mais je ne vous ai pas encore testés ET ALORS ?" },
  ]

  let specialNickname = specialNickname_list.find(x => {
    return x.id == newState.member.id
  })?.name ?? null


  if(oldState.channelId != newState.channelId) {
    let temp1_chan_no_mic_list = all_channels_with_no_mic.filter(x => {
      return x.voiceID == newState.channelId
    })
    if(temp1_chan_no_mic_list.length > 0){
      let temp1_chan_no_mic = temp1_chan_no_mic_list[0]
      newState.member.roles.add(temp1_chan_no_mic.roleID)
    }
    
    let temp2_chan_no_mic_list = all_channels_with_no_mic.filter(x => {
      return x.voiceID == oldState.channelId
    })
    if(temp2_chan_no_mic_list.length > 0){
      let temp2_chan_no_mic = temp2_chan_no_mic_list[0]
      newState.member.roles.remove(temp2_chan_no_mic.roleID)
    }
  }


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
            .setAuthor({ name: `${specialNickname ?? member.nickname ?? member.user.username} est arrivé !`, iconURL: member.displayAvatarURL() })
            .setColor("00FF00")
        ]
      }).catch(e => {
        console.log("pas envoyé:",e)
      })

      // Gif perso JOIN channel | Pour modifier aller dans config.js > static > voiceJoinLeaveGifs
      client.config.static.voiceJoinLeaveGifs.forEach(item => {
        try {
          if(item.userID != newState.member.id) return;
          if(!item.config.enabled) return;
          if(item.join.exceptions.hasOwnProperty(newState.channel.id) && item.config.enableExceptions) {
            le_no_micro_channel[0].send({ content: item.join.exceptions[newState.channel.id] })
          } else {
            le_no_micro_channel[0].send({ content: item.join.default })
          }
        } catch(e) {
          console.warn(`[WARN /logs/voiceStateUpdate.js]`,e)
        }
      })

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
            .setAuthor({ name: `${specialNickname ?? member.nickname ?? member.user.username} est parti ..`, iconURL: member.displayAvatarURL() })
            .setColor("FF0000")
        ]
      }).catch(e => {
        console.log("pas envoyé:",e)
      })

      // Gif perso LEAVE channel | Pour modifier aller dans config.js > static > voiceJoinLeaveGifs
      client.config.static.voiceJoinLeaveGifs.forEach(item => {
        try {
          if(item.userID != oldState.member.id) return;
          if(!item.config.enabled) return;
          if(item.leave.exceptions.hasOwnProperty(oldState.channel.id) && item.config.enableExceptions) {
            le_no_micro_channel[0].send({ content: item.leave.exceptions[oldState.channel.id] })
          } else {
            le_no_micro_channel[0].send({ content: item.leave.default })
          }
        } catch(e) {
          console.warn(`[WARN /logs/voiceStateUpdate.js]`,e)
        }
      })

    } else {
      console.log("No no-mic channel found for voiceUpdate join.")
    }


  } else if (oldState.streaming != newState.streaming) {
    //console.log("streaming:",newState)
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