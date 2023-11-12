const {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle
} = require("discord.js")

const {
  roles
} = require('../../config');

module.exports = {
  name: "addalltobdd",
  type: ApplicationCommandType.ChatInput,
  description: "Ajoute tous les membres à la base de données",
  // default_member_permissions: ['Administrator'],
  async run(client, interaction) {

    let members = interaction.guild.members.cache.filter(x => {
      return x._roles.includes(client.config.static.roles.membre)
    }).map(x => x)


    let ok=0;
    let notok=0;
    let total=0;
    let failedList = []

    for(let i in members) {
      let member = members[i]
      try {
        let response = await client.db.initUser(member.user)
        console.log(`response for ${member.id} -> `,response)
        ok++
      } catch(e) {
        notok++
        failedList.push(member)
        console.log(e)
      }
      total++
    }

    interaction.reply({
      content: `Opération terminée. ${ok}/${total} OK. ${notok} failed.${failedList.length == 0 ? "" : `\nFailed ID list: \`${failedList.join("\n")}\``}`
    })

  }
}