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

    interaction.deferReply()

    let members = interaction.guild.members.cache.filter(x => {
      return x._roles.includes(client.config.static.roles.membre)
    })


    let ok=0;
    let notok=0;
    let total=0;
    let failedList = []

    var bar = new Promise((resolve, reject) => {
      members.forEach(async (member, index, array) => {
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
        if (index === array.length -1) resolve();
      })
    });

    bar.then(() => {
      interaction.editReply({
        content: `OK. Opération terminée. ${ok}/${total} OK. ${notok} failed.${failedList.length == 0 ? "" : `\nFailed ID list: \`${failedList.join("\n")}\``}`
      })
    }).catch(e => {
      interaction.editReply({
        content: `Error:x: Opération terminée. ${ok}/${total} OK. ${notok} failed.${failedList.length == 0 ? "" : `\nFailed ID list: \`${failedList.join("\n")}\``}\`\`\`js\n${e.stack}\`\`\``
      })
    })
    


  }
}