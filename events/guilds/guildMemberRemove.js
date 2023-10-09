const { EmbedBuilder } = require('discord.js');

const delay = ms => new Promise(res => setTimeout(res, ms))




module.exports = async (client, member) => {

  /****** DISABLED CODE ******/
  console.warn("DISABLED CODE. guildMemberRemove.js:6")
  return;
  /****** DISABLED CODE ******/

  const user = await client.db.users.findOne({
    userID: member.id
  });

  if (!user) return;

  const channel = client.channels.cache.get('1137065763820273695');

  if (user.isMember) {
    channel.send({
      files: [{
        attachment: Buffer.from(JSON.stringify(user)),
        name: 'backUp.json',
      }]
    }).then(msg => {
      const urlToPaste = msg?.attachments?.map(x => x.url);

      const embed = new EmbedBuilder()
        .setTitle(`Donnée de ${user.userID}`)
        .setDescription(`[**Clique ici pour accéder aux données**](${urlToPaste})`)
        .setColor(0x44ff44)
        .setTimestamp();

      channel.send({
        embeds: [embed]
      });
    });
  }

  await delay(2000);

  client.db.users.deleteMany({
    userID: member.id
  });
}