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
  

  let all_channels_with_no_mic = client.config.static.voiceChannels.filter(x => {
    return (
      x.hasOwnProperty("noMicChannel_roleID")
      && x.noMicChannel_roleID != undefined
      && x.noMicChannel_roleID != false
      && typeof x.noMicChannel_roleID == 'string'
      && guild.roles.cache.get(x.noMicChannel_roleID) != undefined
    )
  })

  let specialNickname_list = client.config.static.specialNicknames
  let _specialNickname_value = specialNickname_list.find(x => {
    return x.id == newState.member.id
  }) ?? null
  
  let specialNickname = {}
  specialNickname.getDefault = () => { return _specialNickname_value?.name || (newState.member.nickname || newState.member.user.username) }
  specialNickname.getJoin = () => {
    if(!_specialNickname_value) return specialNickname.getDefault()
    if(_specialNickname_value.voice.join == true) return specialNickname.getDefault()
    else if(typeof _specialNickname_value.voice.join == 'string') return _specialNickname_value.voice.join
    else { return (newState.member.nickname || newState.member.user.username) }
  }
  specialNickname.getLeave = () => {
    if(!_specialNickname_value) return specialNickname.getDefault()
    if(_specialNickname_value.voice.leave == true) return specialNickname.getDefault()
    else if(typeof _specialNickname_value.voice.leave == 'string') return _specialNickname_value.voice.leave
    else { return (newState.member.nickname || newState.member.user.username) }
  }

  if(oldState.channelId != newState.channelId) {
    

    function getNoMicRoleOfChannelByChannelId(channelID) {
      if(!channelID) return null
      console.log("channelID:",channelID)
      let temp1_chan_no_mic_list = all_channels_with_no_mic.filter(configVoiceChannel => {
        return configVoiceChannel.id == channelID
      })
      console.log("temp1_chan_no_mic_list:",temp1_chan_no_mic_list)
      if(temp1_chan_no_mic_list.length > 0){
        let temp1_chan_no_mic = temp1_chan_no_mic_list[0]
        return temp1_chan_no_mic.noMicChannel_roleID
      }
      return null
    }
    
    let oldChannelNoMicRoleID = getNoMicRoleOfChannelByChannelId(oldState.channelId)
    if(oldChannelNoMicRoleID) {
      console.log("removing role",oldChannelNoMicRoleID)
      await oldState.member.roles.remove(oldChannelNoMicRoleID)
    }

    let newChannelNoMicRoleID = getNoMicRoleOfChannelByChannelId(newState.channelId)
    if(newChannelNoMicRoleID){
      console.log("adding role",newChannelNoMicRoleID)
      await newState.member.roles.add(newChannelNoMicRoleID)
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
            .setAuthor({ name: `${specialNickname.getJoin()} est arrivé !`, iconURL: member.displayAvatarURL() })
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
            .setAuthor({ name: `${specialNickname.getLeave()} est parti ..`, iconURL: member.displayAvatarURL() })
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