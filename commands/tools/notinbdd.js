const Discord = require('discord.js');
const { joinVoiceChannel } = require("@discordjs/voice");
const {
  ApplicationCommandType
} = Discord;
const canvasCmd = require('../../functions/canvasCmd');

module.exports = {
  name: "notinbdd",
  description: "Les commandes pour Jay !",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {

    let all_in_bdd = (await client.db._makeQuery(`SELECT user_id FROM users`)).map(x => x.user_id)

    let all_members = interaction.guild.members.cache.filter((x) => {
      return x._roles.includes(client.config.static.roles.membre)
    }).map(x => {
      return x.id
    })

    let filtered = []

    for(let i in all_members) {
      if(all_in_bdd.includes(all_members[i])) {

      } else {
        filtered.push(all_members[i])
      }
    }

    interaction.reply({
      ephemeral: true,
      embeds: [
        new Discord.EmbedBuilder()
        .setDescription(`**${filtered.length} personnes ont le role membre mais ne sont pas dans la base de données.**\n\n`+filtered.map(x => {
          return `\`${x}\` <@${x}>`
        }).join("\n"))
      ]
    })

    
  }
}