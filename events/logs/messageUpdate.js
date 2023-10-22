const {
  EmbedBuilder
} = require('discord.js');

module.exports = async (client, oldMessage, newMessage) => {

  return;

  if (oldMessage.partial) oldMessage = await oldMessage.fetch();
  if (newMessage.partial) newMessage = await newMessage.fetch();

  if (newMessage.author.bot) return;
  if (!newMessage.editedAt) return;

  const logEmbed = new EmbedBuilder()
    .setColor(0xff7f00)
    .setDescription(`Un [message](${oldMessage.url}) a été édité par ${oldMessage.author} dans ${oldMessage.channel}`)
    .addFields({
      name: 'Message originale',
      value: `\`\`\`${(oldMessage.length <= 512 ? oldMessage.content : oldMessage.content.substring(0,512))}\`\`\``
    }, {
      name: 'Nouveau message',
      value: `\`\`\`${(newMessage.length <= 512 ? newMessage.content : newMessage.content.substring(0,512))}\`\`\``
    })
    .setTimestamp()

  try {
    newMessage.guild.channels.cache.get('1094318710430380038').send({
      embeds: [logEmbed]
    });
  } catch (err) {}
}