const cron = require('node-cron');
const stats = require('../../functions/userStats');
const {
  EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js');

module.exports = async (client) => {
  cron.schedule('10 * * * * *', async () => { // Toutes les minutes
    try {
      stats.addVoc(client);
    } catch (err) {

    }
  });

  cron.schedule('*/10 * * * * *', () => { // Toutes les 10 secondes
    try {
      const guild = client.guilds.cache.get(client.config.getCurrentGuildID());

      client.config.chanStats.map(x => {
        const role = guild.roles.cache.get(x.role);
        const n = role.members.size;
        const chan = guild.channels.cache.get(x.chan);
        if (chan.name === x.name.replace('%n', n)) return;
        chan.edit({
          name: x.name.replace('%n', n)
        });
      });
    } catch (err) {

    }
  });

  cron.schedule('0 * * * *', async () => { // Toutes les heures
    const dtb = {
      users: [],
      guilds: []
    };

    /*
    const users = await client.db.users.find().catch(e => { });
    users.map(x => {
      dtb.users.push(x);
    });

    const guilds = await client.db.guilds.find().catch(e => { });
    guilds.map(x => {
      dtb.guilds.push(x);
    });
    */

    client.channels.cache.get('1094318711202140250').send({
      files: [{
        attachment: Buffer.from(JSON.stringify(dtb)),
        name: 'backUp.json',
      }]
    }).then(msg => {
      const urlToPaste = msg?.attachments?.map(x => x.url);

      const embed = new EmbedBuilder()
        .setTitle(`Nouvelle BackUp ✅`)
        .setDescription(`[**Clique ici pour accéder à la backUp**](${urlToPaste})`)
        .setColor(0x44ff44)
        .setTimestamp();

      client?.channels?.cache?.get('1135231474849820752').send({
        embeds: [embed],
        components: [
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('loadthisbackup')
                .setLabel('Load this backUp')
                .setDisabled(true)
                .setStyle(ButtonStyle.Success),
            )
        ]
      });
    });
  });

  // await delay(2000);
  // invites.restart(client);
};