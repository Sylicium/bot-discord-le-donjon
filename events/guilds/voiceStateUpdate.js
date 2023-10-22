const { EmbedBuilder } = require('discord.js');
const delay = ms => new Promise(res => setTimeout(res, ms))

module.exports = async (client, oldState, newState) => {

  // console.log("voiceStateUpdate OLD:",oldState)
  // console.log("voiceStateUpdate OLD:",newState)

  let whiteList_voiceCamera_pre = client.config.static.voiceChannels.filter(x => { return x.whitelistCamera == true })

  // console.log("whiteList_voiceCamera_pre:",whiteList_voiceCamera_pre)
  let whiteList_voiceCamera = whiteList_voiceCamera_pre.map(x => { return x.id })
  // console.log("whiteList_voiceCamera:",whiteList_voiceCamera)

  if(newState.channel && newState.selfVideo && (oldState?.channel?.id == newState?.channel?.id)) {
    if(newState.member.permissions.has(8n)) return; // 8n ADMINISTRATOR
    if(!whiteList_voiceCamera.includes(newState.channel.id)) {
      newState.member.user.send({
        content: `[**${newState.channel.guild.name}**] Vous n'avez pas le droit de mettre votre caméra en vocal ! Vous avez été kick du salon vocal en conséquences.`
      }).then(() => {}).catch(e => {
        console.log(e)
      })
      return newState.member.voice.disconnect("Caméra allumée");
    }
  }


  client.config.vocs.map(x => {
    let role = x.role // Role pour le salon muted

    if (oldState.channelId === null) { // Join
      if (newState.channelId === x.chan) {
        annonce(client, null, newState, x);
        addRole(newState, role)
      }
    } else if (newState.channelId === null) { // Leave
      if (oldState.channelId === x.chan) {
        annonce(client, oldState, null, x);
        removeRole(oldState, role)
        leaveFunction(client, oldState, x)
      }
    } else if (oldState.channelId != newState.channelId) { // Change Voc
      if (oldState.channelId === x.chan) {
        annonce(client, oldState, null, x);
        removeRole(oldState, role);
        leaveFunction(client, oldState, x)
      }
      if (newState.channelId === x.chan) {
        annonce(client, null, newState, x);
        addRole(newState, role);
      }
    }
  });
}

async function addRole(evt, role) {
  let user = evt.guild.members.cache.get(evt.id);
  if (user.roles.cache.has(role)) return;
  try {
    user.roles.add(role);
  } catch (err) { };
}

async function annonce(client, oldState, newState, x) {
  if (oldState) {
    const Guild = client.guilds.cache.get(oldState.guild.id);
    const channel = Guild.channels.cache.find(ch => ch.name === x.noMic && ch.type === 0);
    const member = Guild?.members?.cache?.get(oldState?.id);

    channel?.send({ content: `**${member.nickname || member.user.username}** a quitté le channel.` });
    if (member?.id === "387972033482588161") {
      channel?.send({ content: `https://tenor.com/view/diggah-tunnah-lion-king-dig-a-tunnel-meerkat-what-was-that-gif-27707671` });
    }
  }
  if (newState) {
    const Guild = client.guilds.cache.get(newState.guild.id);
    const channel = Guild.channels.cache.find(ch => ch.name === x.noMic && ch.type === 0);
    const member = Guild?.members?.cache?.get(newState?.id);

    channel?.send({ content: `**${member.nickname || member.user.username}** a rejoint le channel.` });
    if (member?.id === "387972033482588161") {
      channel?.send({ content: `https://tenor.com/view/lick-c-at-cute-tongue-out-gif-15308597` });
    }
  }
}

async function removeRole(evt, role) {
  let user = evt.guild.members.cache.get(evt.id);
  if (!user.roles.cache.has(role)) return;
  try {
    user.roles.remove(role);
  } catch (err) { };
}

async function leaveFunction(client, evt, x) {
  const Guild = client.guilds.cache.get(evt.guild.id);

  let voiceChannel = await Guild.channels.fetch(x.chan, {
    force: true
  });
  if (voiceChannel.members.size > 0) return;

  let i = 1;
  let iMax = client.config.tempResetChan * 12

  do {
    await delay(5 * 1000);

    if (voiceChannel.members.size > 0) return;

    if (i == iMax) {
      const channel = Guild.channels.cache.find(ch => ch.name === x.noMic && ch.type === 0);
      const position = channel.position;
      const newChannel = await channel.clone();
      await channel.delete();
      newChannel.setPosition(position);

      try {
        const embed = new EmbedBuilder()
          .setTitle("Auto Clear ✔")
          .setColor(0xff0000)
          .setDescription(`Le salon écris \`${x.noMic}\` a été reset automatiquement après une période d'inactivitée de 1 minute dans le vocal lié à celui-ci.`)
          .setTimestamp()
        Guild.channels.cache.get('1094318710430380039').send({
          embeds: [embed]
        });
      } catch (err) { }
    }

    i++

  } while (i <= iMax);
}