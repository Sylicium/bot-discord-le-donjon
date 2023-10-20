const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const moment = require("moment");
const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
  name: 'moderation',
  type: ApplicationCommandType.ChatInput,
  description: 'Groupe des commandes disponibles pour la modération.',
  default_member_permissions: ['Administrator'],
  options: [
    {
      name: "clear",
      description: "Supprimer un nombre des messages allant de 0 à 100",
      type: 1,
      options: [{
        name: "nombre",
        description: "nombre de message(s) à supprimer",
        type: 10,
        required: true
      }]
    }, {
      name: "kick",
      description: "Kick d'un membre en raison d'un retard dans la validation de règlement/ouverture ticket.",
      type: 1,
      options: [{
        type: 6,
        name: 'membre',
        description: 'membre à ban',
        required: true
      }]
    }, {
      name: "mute",
      description: "Mute (timeout/exclure) un membre en l'affichant bien gentillement dans le pilori.",
      type: 1,
      options: [{
        type: 6,
        name: 'membre',
        description: 'Quel est le membre ciblé ?',
        required: true
      }, {
        type: 3,
        name: 'temps',
        description: 'Écris le temps de mute. Exemple: 3d, 2d 5h, 2h 3m, 5d 1h 7m',
        required: true
      }, {
        type: 3,
        name: 'raison',
        description: 'Raison du mute.',
        required: false
      }, {
        type: 3,
        name: 'url',
        description: 'URL du gif.',
        required: false,
      }]
    }, {
      name: "ban",
      description: "Ban d'un membre en l'affichant bien gentillement dans le pilori.",
      type: 1,
      options: [{
        type: 6,
        name: 'membre',
        description: 'Quel est le membre ciblé ?',
        required: true
      }, {
        type: 3,
        name: 'raison',
        description: 'Raison du ban.',
        required: false
      }, {
        type: 3,
        name: 'url',
        description: 'URL du gif.',
        required: false,
      }]
    }, {
      name: "ban_id",
      description: "Ban d'un membre par l'identifiant.",
      type: 1,
      options: [{
        type: 3,
        name: 'membre_id',
        description: 'membre à ban',
        required: true
      }, {
        type: 3,
        name: 'raison',
        description: 'Raison du ban.',
        required: false
      }, {
        type: 3,
        name: 'url',
        description: 'URL du gif.',
        required: false,
      }]
    },
  ], async run(client, interaction) {
    const Subcommand = interaction.options.getSubcommand() || null;
    if (!Subcommand) return interaction.reply({ content: 'Quelque chose s\'est mal passé..', ephemeral: true });

    const guild = client.guilds.cache.get(interaction.guild.id);
    const channel = guild?.channels?.cache?.get(client.config.static.channels.ban_pilori);
    // const reportChannel = guild?.channels?.cache?.get('1111111111111111'); // Disabled
    const userId = interaction.options.getString('membre_id') || interaction?.options?.getUser('membre')?.id || null;
    const time = interaction?.options?.getString('temps') || null;
    const reason = interaction.options.getString('raison') || null;
    const url = interaction.options.getString('url') || null;

    var member;

    if (userId) member = guild.members.cache.get(userId);
    if (!member && Subcommand != 'clear' && Subcommand != 'ban_id') return interaction.reply({ content: 'Quelque chose s\'est mal passé..', ephemeral: true });

    switch (Subcommand) {
      case 'kick':
        member.send(`Tu as intégré le serveur le **${moment(member.joinedAt).locale('fr').format("LLL")}** et été expulsé pour ne pas avoir validé le règlement et/ou ouvert de ticket sur le donjon, si tu souhaites revenir, voici un lien du serveur https://discord.gg/M8ayrPf85z`).then(m => {
          member.kick("Retard validation règlement / non ouverture ticket.").then(m => {
            interaction.reply({ content: `Vous venez de kick <@${member.id}>.`, ephemeral: true });
          }).catch(e => {
            console.log(e)
            interaction.reply({
              content: `Impossible de kick cet utilisateur \`\`\`js\n${e}\`\`\``
            })
          })
        });
        break
      case 'ban':

        member.send({ content: `Tu as été banni par <@${interaction?.user?.id}>${reason ? ` pour la raison suivante: \n\n\`\`\`${reason}\`\`\`` : "."}` }).catch(e => { })
        if (url) member.send({ content: url }).catch(e => { })

        // reportChannel?.send({ content: `Pseudo: ${member.username}\nID: ${member.id}` });

        channel.send({ content: `<@${interaction?.user?.id}> a banni ${member}${reason ? ` pour la raison suivante: \n\n\`\`\`${reason}\`\`\`` : "."}` });
        if (url) channel.send({ content: url });

        await delay(500);

        member.ban().then(m => {
          interaction?.reply({ content: 'Pilori fait!', ephemeral: true });
        }).catch(e => {
          console.log(e)
          interaction.reply({
            content: `Impossible de bannir cet utilisateur \`\`\`js\n${e}\`\`\``
          })
        })


        break
      case 'ban_id':
        // reportChannel?.send({ content: `Pseudo: / \nID: ${member.id}` });

        guild.bans.create(userId, {
          reason: reason
        }).then(banInfo => interaction.reply({
          content: `Vous venez de ban \`${banInfo.user?.tag ?? banInfo.tag ?? banInfo}\`${reason ? ' pour \`' + reason + '`' : '.'}`,
          ephemeral: true
        })).catch(console.error);
        break
      case 'warn':
        const times = time?.split(' ');

        var d, h, m;

        for (const t of times) {
          if (t?.toLowerCase()?.includes('d')) {
            d = Number(t?.replace('d', '') * 86400000);
          } else if (t?.toLowerCase()?.includes('h')) {
            h = Number(t?.replace('h', '') * 3600000);
          } else if (t?.toLowerCase()?.includes('m')) {
            m = Number(t?.replace('m', '') * 60000);
          } else {
            return interaction?.reply({ content: `Erreur de syntaxe sur le temps : ${time} => **${t}**`, ephemeral: true })
          }
        }

        let warnTime = (d || 0) + (h || 0) + (m || 0);

        member.send({ content: `Tu as été warn pendant ${time} par <@${interaction.user.id}>${reason ? ` pour la raison suivante: \n\n\`\`\`${reason}\`\`\`` : "."}` }).catch(e => { })
        channel.send({ content: `<@${interaction.user.id}> a warn ${member} pendant ${time}${reason ? ` pour la raison suivante: \n\n\`\`\`${reason}\`\`\`` : "."}` })

        if (url) {
          member.send({ content: url }).catch(e => { })
          channel.send({ content: url });
        }

        await delay(500);

        member.timeout(warnTime, reason).then(m => {
          interaction?.reply({ content: 'Warn fait!', ephemeral: true });
        }).catch(e => {
          console.log(e)
          interaction.reply({
            content: `Impossible de timeout (mute) cet utilisateur \`\`\`js\n${e}\`\`\``
          })
        })

        break
      case 'clear':
        const n = interaction.options.getNumber('nombre');

        if (n < 1) return errNum(interaction);
        if (n > 100) return errNum(interaction);

        const chan = interaction.guild.channels.cache.get(interaction.channelId)
        try {
          chan.bulkDelete(n, true).then(info => {
            if (info.size < n) return replyOld(interaction, n, info.size);
            reply(interaction, n);
          });
        } catch (err) {
          errDel(interaction, n);
        }

        break
    }
  }
}

function reply(i, n) {
  const embed = new EmbedBuilder()
    .setDescription('Vous venez de supprimer %n message(s)'.replace('%n', n))
    .setColor(0x1ce825);

  i.reply({
    embeds: [embed],
    ephemeral: true
  });
}

function replyOld(i, n, n2) {
  const embed = new EmbedBuilder()
    .setDescription('Vous venez de supprimer %n message(s) sur les &n demandé.'.replace('%n', n2).replace('&n', n))
    .setColor(0x1ce825);

  i.reply({
    embeds: [embed],
    ephemeral: true
  });
}

function errNum(i) {
  const embed = new EmbedBuilder()
    .setDescription('Le nombre de message doit être compris entre 0 et 100.')
    .setColor(0xe81c1c);

  i.reply({
    embeds: [embed],
    ephemeral: true
  });
}

function errDel(i) {
  const embed = new EmbedBuilder()
    .setDescription('Une erreur est survenue lors de l\'éxecution de la commande.')
    .setColor(0xe81c1c);

  i.reply({
    embeds: [embed],
    ephemeral: true
  });
}