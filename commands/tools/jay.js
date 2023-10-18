const Discord = require('discord.js');
const {
  ApplicationCommandType
} = Discord;
const canvasCmd = require('../../functions/canvasCmd');

module.exports = {
  name: "jay",
  description: "Affiche le classement des membres du serveur.",
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: [],
  run: async (client, interaction) => {

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
  }
}