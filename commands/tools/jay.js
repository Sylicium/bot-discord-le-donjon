const Discord = require('discord.js');
const { joinVoiceChannel } = require("@discordjs/voice");
const {
  ApplicationCommandType
} = Discord;
const canvasCmd = require('../../functions/canvasCmd');

module.exports = {
  name: "jay",
  description: "Les commandes pour Jay !",
  type: ApplicationCommandType.ChatInput,
  options: [{
    type: Discord.ApplicationCommandOptionType.Subcommand,
    name: 'heure',
    description: 'Jay, il est quelle heure chez toi ?',
  }, {
    type: Discord.ApplicationCommandOptionType.Subcommand,
    name: 'soustitre',
    description: "Oskour t'a dis quoi Jay ??",
  }, {
    type: Discord.ApplicationCommandOptionType.Subcommand,
    name: 'stopsoustitre',
    description: "Arrête le sous-titrage c'est trop là t'abuse",
  }],
  run: async (client, interaction) => {
    
    let subCommand = interaction.options.getSubcommand()

    if(subCommand == "heure") {
      let date_france = new Date()
      let date_canada = new Date(date_france.getTime() - 6*3600*1000)
  
      function getDiscordTimestamp(timestamp) {
        return Math.floor(timestamp/1000)
      }
  
      interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle(`Date et heure`)
            .setDescription([
              `France: <t:${getDiscordTimestamp(date_france.getTime())}:t> (<t:${getDiscordTimestamp(date_france.getTime())}:d>)`,
              `Canada: <t:${getDiscordTimestamp(date_canada.getTime())}:t> (<t:${getDiscordTimestamp(date_canada.getTime())}:d>)`,
            ].join("\n"))
        ]
      })
    } else if(subCommand == "soustitre") {

      const voiceChannel = interaction.member?.voice.channel;
      if (voiceChannel) {
        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          selfDeaf: false,
        });
      }

      return interaction.reply({
        content: `Plop ! Me voilà dans le channel pours sous-titrer Jay !`
      })

    } else if(subCommand == "stopsoustitre") {

      interaction.guild.members.cache.get(client.user.id).voice.disconnect();

      return interaction.reply({
        content: `Je fuis du vocal !!`
      })

    } else {
      interaction.reply({
        content: `What? y'a eu un bug là ;-; \`\`\`Impossible de trouver la subcommande ${subCommand}\`\`\``
      })
    }



    
  }
}