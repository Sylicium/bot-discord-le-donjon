const {
  EmbedBuilder,
} = require("discord.js");
const moment = require('moment');

module.exports = async (client, message) => {

  if (message.channel.parentId === "1094318710715580571") return;

  const embed = new EmbedBuilder()
    .setTitle("Message Supprimé")
    .setColor(0xff0000)
    .setDescription(`Le message de ${message.author} envoyé le **${moment(message.createdTimestamp).locale('fr').format("LLL")}** a été supprimé du channel ${message.channel} ${message.content ? `\n\`\`\`${message.length <= 512 ? message.content : message.content.substring(0, 512)}\`\`\`` : '\n\n**Pas de contenu**'}`)
    .setTimestamp()

  try {
    message.guild.channels.cache.get('1094318710430380038').send({
      embeds: [embed]
    });
  } catch (err) { }

  if (message.attachments != null) {
    message.attachments.map(x => {
      const embed = new EmbedBuilder()
        .setTitle('Image supprimée')
        .setDescription(`L'image de ${message.author} envoyé le **${moment(message.createdTimestamp).locale('fr').format("LLL")}** a été supprimé du channel ${message.channel}`)
        .setColor(0xff0000)
        .setImage(x.attachment)
        .setTimestamp()

      try {
        message.guild.channels.cache.get('1094318710430380038').send({
          embeds: [embed]
        });
      } catch (err) { }
    });
  }
}