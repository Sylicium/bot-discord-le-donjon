const { ApplicationCommandType, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    name: "boost",
    type: ApplicationCommandType.ChatInput,
    description: "Affiche les membres avec boosts.",
    default_member_permissions: ['Administrator'],    
    run: async (client, interaction) => {
       const boosters = interaction.guild.members.cache.filter((member) => member.premiumSince !== null);
       console.log('Membres boosters :');
       boosters.forEach((member) => {
        console.log(`${member.user.tag}`);
      });
    }
  }