const { EmbedBuilder } = require('discord.js');

module.exports = async (client, member) => {
  const embed = new EmbedBuilder()
    .setColor('Green')
    .setDescription(`**Vient de rejoindre le serveur.**`)
    .setTimestamp()

  const channel = client.channels.cache.get('1102614305771364412');
  channel.send({content: `${member.user}`, embeds: [embed]});
}