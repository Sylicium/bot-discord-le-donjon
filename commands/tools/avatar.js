const {
  ApplicationCommandType,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  name: 'avatar',
  type: ApplicationCommandType.ChatInput,
  description: "Afficher la photo de profile de sois ou d'un utilisateur",
  options: [{
    name: 'utilisateur',
    description: 'Sélectionner la personne souhaitée',
    type: 6,
    required: false
  }],
  run: async (client, interaction) => {
    const member = interaction.options.getUser('utilisateur') ? interaction.guild.members.cache.get(interaction.options.getUser('utilisateur').id) : interaction.member;

    const avatar  = member?.avatar

    /*
    const avatar = member?.avatar ? member?.displayAvatarURL({
      size: 4096,
      dynamic: true,
      format: "png",
    }) : member.user.displayAvatarURL({
      size: 4096,
      dynamic: true,
      format: "png",
    });
    */
  
  
    const embed = new EmbedBuilder()
      .setTitle(`Avatar de ${member?.nickname || member?.user?.username}`)
      .setURL(avatar)
      .setImage(avatar);
  
    interaction.reply({
      embeds: [embed]
    });
  }
};