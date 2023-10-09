const { EmbedBuilder } = require("discord.js")
const {
  ApplicationCommandType
} = require('discord.js');
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


    /****** DISABLED COMMAND ******/
    return client.disabledCommand(interaction)
    /****** DISABLED COMMAND ******/




    const user = interaction.options.getUser('utilisateur') ? interaction.guild.members.cache.get(interaction.options.getUser('utilisateur').id) : interaction.member;
    const userDB = await client.db.users.findOne({
      userID: user.id,
      guildID: interaction.guild.id
    }).catch(e => { console.log(e) });
    const nick = user.nickname === null ? "Pas de pseudo" : user.nickname;
    const usericon = user.displayAvatarURL({
      size: 2048,
      dynamic: true,
      format: "png",
    });

    if (!userDB) return interaction.reply({ content: `Cet utilisateur n'a pas de BDD. Ceci n'est pas normal ! Contactez StarKleey.` });

    var duration = moment.duration(userDB.stats.voc, 'minutes')
    const durationString = userDB.stats.voc > 0 ? [duration.months() ? duration.months() + 'Mois' : '', duration.days() ? duration.days() + 'J' : '', duration.hours() ? duration.hours() + 'H' : '', duration.minutes() ? duration.minutes() + 'M' : ''].filter(elm => elm).join(' ') : '0 minutes';

    const embed = new EmbedBuilder()
      .setTitle(`User Info`)
      .setThumbnail(usericon)
      .addFields([{
        name: `General Info`,
        value: `Pseudo: \`${user.user.username}\` \nID:  \`${user.id}\` \nTag: \`${user.user.discriminator}\` \nsurnom: \`${nick}\``
      }, {
        name: 'Niveau/XP: ',
        value: `Level: \`${userDB.stats.lvl}\`\nXP: \`${userDB.stats.xp}\`\nBonus: \`${userDB.stats.bonus}\``,
      }, {
        name: 'Stats', //durationString
        value: `Message: \`${userDB.stats.msg}\`\nTemps de vocal: \`${durationString}\`\nImage: \`${userDB.stats.img}\`\nReaction: \`${userDB.stats.react}\``,
        inline: true
      }, {
        name: `Roles:`,
        value: `<@&${user._roles.join(">  <@&")}>`
      }, {
        name: 'Compte créé le:',
        value: `\`${moment(user.user.createdAt).locale('fr').format("LLL")}\``,
        inline: true
      }, {
        name: 'À rejoint le serveur le:',
        value: `\`${moment(user.joinedAt).locale('fr').format("LLL")}\``,
        inline: true
      }]);
    interaction.reply({
      embeds: [embed]
    })
  }
}