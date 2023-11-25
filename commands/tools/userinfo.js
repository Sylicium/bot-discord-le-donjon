const Discord = require('discord.js');
const { EmbedBuilder, DiscordAPIError, ApplicationCommandType} = Discord
const moment = require("moment");

module.exports = {
  name: "userinfo",
  description: "affiche l'info de l'utilisateur",
  type: ApplicationCommandType.ChatInput,
  options: [{
    name: 'utilisateur',
    description: 'Personne que tu souhaite voir les informations',
    type: 6
  }],
  run: async (client, interaction) => {

    const member = interaction.options.getUser('utilisateur') ? interaction.guild.members.cache.get(interaction.options.getMember('utilisateur').id) : interaction.member;
    const userDB = await client.db.getUserStats(member.id)

    if(!userDB) {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
          .setColor("FF0000")
          .setDescription(`Utilisateur introuvablze`)
        ]
      })
    }

    const nick = member.nickname == null ? "Pas de pseudo" : member.nickname;
    const usericon = member.displayAvatarURL().replace(".webp",".png?size=4096");

    if (!userDB) return interaction.reply({ content: `Cet utilisateur n'a pas de BDD. Ceci n'est pas normal ! Contactez StarKleey.` });

    var duration = moment.duration(userDB.minutesInVoice, 'minutes')
    const durationString = userDB.minutesInVoice > 0 ? [duration.months() ? duration.months() + 'Mois' : '', duration.days() ? duration.days() + 'J' : '', duration.hours() ? duration.hours() + 'H' : '', duration.minutes() ? duration.minutes() + 'M' : ''].filter(elm => elm).join(' ') : '0 minutes';

    const embed = new EmbedBuilder()
      .setTitle(`User Info`)
      .setThumbnail(usericon)
      .addFields([{
        name: `General Info`,
        value: `Pseudo: \`${member.user.username}\` \nID:  \`${member.id}\` \nTag: \`${member.user.discriminator}\` \nsurnom: \`${nick}\``
      }, {
        name: 'Niveau/XP: ',
        value: `Level: \`${userDB.level}\`\nXP: \`${userDB.xp}\`\nBonus: \`${userDB.bonus}\``,
      }, {
        name: 'Stats', //durationString
        value: `Message: \`${userDB.messages}\`\nTemps de vocal: \`${durationString}\`\nImage: \`${userDB.img}\`\nReaction: \`${userDB.react}\``,
        inline: true
      }, {
        name: `Roles:`,
        value: `<@&${member._roles.join(">  <@&")}>`
      }, {
        name: 'Compte créé le:',
        value: `\`${moment(member.user.createdAt).locale('fr').format("LLL")}\``,
        inline: true
      }, {
        name: 'À rejoint le serveur le:',
        value: `\`${moment(member.joinedAt).locale('fr').format("LLL")}\``,
        inline: true
      }]);
    interaction.reply({
      embeds: [embed]
    })
  }
}