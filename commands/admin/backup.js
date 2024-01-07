const {
  ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js');

module.exports = {
  name: 'backup',
  type: ApplicationCommandType.ChatInput,
  description: "faire une backup",
  //default_member_permissions: ['Administrator'],
  run: async (client, interaction) => {


    let dtb = {
      users: ( await client.db._makeQuery(`SELECT * FROM users`) ),
      userstats: ( await client.db._makeQuery(`SELECT * FROM user_stats`) )
    };


    client.channels.cache.get(client.config.static.channels.backupSend).send({
      files: [{
        attachment: Buffer.from(client.somef.JSONBigInt.stringify(dtb)),
        name: `${client.somef.formatDate(Date.now(),"Backup_donjon_YYYY-MM-DD_hh-mm-ss_manual")}.json`,
      }]
    }).then(msg => {

      interaction.reply({
        content: `Backup envoyée dans le [channel de backups](https://ptb.discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`
      })
      const urlToPaste = msg?.attachments?.map(x => x.url);

      const embed = new EmbedBuilder()
        .setTitle(`Nouvelle BackUp ✅`)
        .setDescription(`[**Clique ici pour accéder à la backUp**](${urlToPaste})`)
        .setColor(0x44ff44)
        .setTimestamp();

        
      client?.channels?.cache?.get(client.config.static.channels.backupSend).send({
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
      

    }).catch(e => {
      console.log("Error commands/admin/backup.js:",e)
      interaction.reply({
        content: `Une erreur est survenue: \`\`\`js\n${e.stack}\`\`\``
      })
    })


    return;
    
    /*
    let dtb = {
      users: [],
      guilds: []
    };

    const users = await client.db.users.find().catch(e => { });
    users.map(x => {
      dtb.users.push(x);
    });

    const guilds = await client.db.guilds.find().catch(e => { });
    guilds.map(x => {
      dtb.guilds.push(x);
    });

    client?.channels?.cache?.get('1094318711202140250').send({
      files: [{
        attachment: Buffer.from(JSON.stringify(dtb)),
        name: 'backUp.json',
      }]
    }).then(msg => {
      const urlToPaste = msg?.attachments?.map(x => x.url);

      const embed = new EmbedBuilder()
        .setTitle(`Nouvelle BackUp Forcée ✅`)
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
    */
  }
};