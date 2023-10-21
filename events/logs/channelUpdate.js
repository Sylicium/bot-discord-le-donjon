const Discord = require('discord.js');

module.exports = async (client, oldChannel, newChannel) => {
  console.log("channel Update", oldChannel, newChannel)



  /** Récuère le log correspondant à l'évent channelUpdate émit actuel **/
  newChannel._getLog = async () => {
    const logs = (await newChannel.guild.fetchAuditLogs({
      limit: 10,
      type: Discord.AuditLogEvent
    })).entries
      // console.log("logs:",logs)
    let logs2 = logs.map(x => x).filter(x => {
      return x.target == newChannel.id
    })
    let log = logs2 ? logs2[0] : undefined
    return log
  }
  /*****/
  
	const guild = client.guilds.cache.get(client.config.getCurrentGuildID());
	const logChannel = guild.channels.cache.get(client.config.static.logChannels.channelUpdate)

  if(!logChannel) return console.log(`[channelUpdate.js] logChannel undefined. Not channel with ID=${client.config.static.logChannels.channelUpdate}`)

  // console.log("(await newChannel._getLog()):",(await newChannel._getLog()))

  let temp1 = (await newChannel._getLog())
  if(!temp1) {
    console.log("[logs/channelUpdate.js] Logs are undefined. Cannot read property .executor > Not logging anything.")
    return;
  }
  let executor = temp1.executor


  function getChannelTypeString(num) {
    let tt = [
      { string: "GuildText", num: 0 },
      { string: "DM", num: 1 },
      { string: "GuildVoice", num: 2 },
      { string: "GroupDM", num: 3 },
      { string: "GuildCategory", num: 4 },
      { string: "GuildAnnouncement", num: 5 },
      { string: "AnnouncementThread", num: 10 },
      { string: "PublicThread", num: 11 },
      { string: "PrivateThread", num: 12 },
      { string: "GuildStageVoice", num: 13 },
      { string: "GuildDirectory", num: 14 },
      { string: "GuildForum", num: 15 },
      { string: "GuildNews", num: 5 },
      { string: "GuildNewsThread", num: 10 },
      { string: "GuildPublicThread", num: 11 },
      { string: "GuildPrivateThread", num: 12 },
    ]
    return tt.filter(x => x.num == num)[0]?.string ?? null
  }

  if(oldChannel.name != newChannel.name) {
    logChannel.send({
      content: "",
      embeds: [
        new Discord.EmbedBuilder() 
          .setTitle("Salon modifié")
          .setColor("FF0000")
          .setDescription([
            `Channel: <#${newChannel.id}> (\`${newChannel.id}\`)`,
            `Type: \`${getChannelTypeString(newChannel.type)}\``,
            `Modifié par: <@${executor.id}> (${executor.username}) (\`${executor.id}\`)`,
            `Ancien nom: \`${oldChannel.name}\``,
            `Nouveau nom: \`${newChannel.name}\``,
          ].join("\n"))
      ]
    })
  }

}