const { ApplicationCommandType, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const types = ["Bonus", "LVL", "XP"];
const options = [{
  name: "type",
  description: "Type de statistique souhaitée.",
  type: 3,
  choices: types.map(x => {
    let choix = {
      name: x,
      value: x.toLowerCase()
    }
    return choix;
  }),
  required: true
}, {
  name: "valeur",
  description: "Valeur du don (Bonus / lvl / xp)",
  type: 10,
  required: true
}, {
  type: 6,
  name: 'membre',
  description: "Cible souhaitée.",
  required: true
}];

module.exports = {
  name: 'bdd',
  type: ApplicationCommandType.ChatInput,
  description: 'Groupe de commands disponibles pour l\' intéraction avec la bdd',
  default_member_permissions: ['Administrator'],
  options: [{
    name: "backup",
    description: 'Crée une backUp de la base de donnée à l\'état actuel.',
    type: 1
  }, {
    name: "transfer",
    description: "Transférer les stats des utilisateurs.",
    type: 1,
    options: [{
      type: 3,
      name: 'ancien',
      description: 'Inscris l\'id de l\'ancien compte',
      required: true
    }, {
      type: 3,
      name: 'nouveau',
      description: 'Inscris l\'id du novueau compte',
      required: true
    }]
  }, {
    name: "give",
    description: "Ajoute le nombre souhaité à la catégorie souhaitée.",
    type: 1,
    options: options
  }, {
    name: "take",
    description: "Enlève le nombre souhaité à la catégorie souhaitée.",
    type: 1,
    options: options
  }, {
    name: "set",
    description: "défini le nombre souhaité à la catégorie souhaitée.",
    type: 1,
    options: options
  }
  ], async run(client, interaction) {
    const Subcommand = interaction.options.getSubcommand() || null;
    if (!Subcommand) return interaction.reply({ content: 'Quelque chose s\'est mal passé..', ephemeral: true });

    if (Subcommand === "backup") {
      const dtb = {
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
    } else if (Subcommand === "transfer") {
      const pastID = interaction.options.getString('ancien');
      const newID = interaction.options.getString('nouveau');

      client.db.users.updateOne({ userID: pastID }, { $set: { userID: newID } }).then(x => {
        return interaction.reply({ content: 'Comtpe transféré!', ephemeral: true })
      }).catch(e => {
        return interaction.reply({ content: "Cela s'est mal passé!" })
      });
    } else {
      const target = interaction.options.getUser('membre');
      const type = interaction.options.getString('type');
      const value = interaction.options.getNumber('valeur');

      const user = await client.db.users.findOne({
        userID: target.id,
        guildID: interaction.guild.id
      }).catch(e => { });

      if (!user) return interaction.reply({ content: `${target}, n'est pas dans la base de donnée.`, ephemeral: true });

      const newXP = calculXP(await newValue(Subcommand, user.stats.lvl, value));
      const newLvl = calculLVL(await newValue(Subcommand, user.stats.xp, value));

      const desc = {
        give: {
          xp: `Vous êtes sur le point de donner ${value} xp à ${target}. \n${user.stats.lvl != newLvl ? `Ceci lui fera passer niveau ${newLvl}.` : 'Ceci ne lui fera passer aucun niveau.'}`,
          lvl: `Vous êtes sur le point de donner ${value} lvl à ${target}.`,
          bonus: `Vous êtes sur le point de donner ${value} points bonus à ${target}. \n${user.stats.lvl != newLvl ? `Ceci lui fera passer niveau ${newLvl}.` : 'Ceci ne lui fera passer aucun niveau.'}`
        },
        set: {
          xp: `Vous êtes sur le point définir l'xp de ${target} sur ${value}. \n${user.stats.lvl != newLvl ? `Ceci lui fera passer niveau ${newLvl}.` : 'Ceci ne lui fera passer aucun niveau.'}`,
          lvl: `Vous êtes sur le point de définir le lvl de ${target} sur ${value}.`,
          bonus: `Vous êtes sur le point définir le nombre de points bonus de ${target} sur ${value}. \nCeci n'affectera ni son niveau, ni son XP total.`
        },
        take: {
          xp: `Vous êtes sur le point de retirer ${value} xp à ${target}. \n${user.stats.lvl != newLvl ? `Ceci lui re fera passer niveau ${newLvl}.` : 'Ceci ne lui fera perdre aucun niveau.'}`,
          lvl: `Vous êtes sur le point de retirer ${value} lvl à ${target}`,
          bonus: `Vous êtes sur le point de retirer ${value} point bonus à ${target}.\nCeci n'affectera ni son niveau, ni son XP total.\nImpossible d'aller dans le négatif ^^.`
        }
      }

      const embed = new EmbedBuilder()
        .setTitle(`${Subcommand} ${type}`)
        .setDescription(desc[Subcommand][type]);

      const confirm = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Confirmer')
        .setStyle(ButtonStyle.Success);

      const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Annuler')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder()
        .addComponents(confirm, cancel);

      switch (Subcommand) {
        case 'give': {
          if (type === "lvl") {
            user.stats.lvl += value;
            user.stats.xp = newXP;
          } else {
            if (type === "bonus")
              user.stats.bonus += value;
            user.stats.lvl = newLvl;
            user.stats.xp += value;
          }
          break
        }
        case 'set': {
          if (type === "lvl") {
            user.stats.lvl = value;
            user.stats.xp = newXP;
          } else if (type === "xp") {
            user.stats.lvl = newLvl;
            user.stats.xp = value;
          } else if (type === "bonus") {
            user.stats.bonus = value;
          }
          break
        }
        case 'take': {
          if (type === "lvl") {
            user.stats.lvl -= value;
            user.stats.xp = newXP;
          } else if (type === "xp") {
            user.stats.lvl = newLvl;
            user.stats.xp -= value;
          } else if (type === "bonus") {
            user.stats.bonus < value ?
              user.stats.bonus = 0 :
              user.stats.bonus -= value;
          }
          break
        }
      }

      const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
      const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });

      collector.on('collect', async i => {
        if (i.customId === "confirm") {
          await user.save().catch(e => console.log(e));
          i.reply({ content: `> **Action exécutée.**` });

          const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirmer')
            .setDisabled(true)
            .setStyle(ButtonStyle.Success);

          const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Annuler')
            .setDisabled(true)
            .setStyle(ButtonStyle.Danger);

          const row = new ActionRowBuilder()
            .addComponents(confirm, cancel);

          message.edit({ components: [row] });
        } else if (i.customId === "cancel") {
          message.delete();
          message.channel.send({ content: `> **Action annulée.**` });
        }
      });

      collector.on('end', (collected, reason) => {
        if (reason != "time") return;
        if (collected.size != 0) return;
        message.delete();
        message.channel.send({ content: `> **Action annulée.**` });
      });
    }
  }
}

async function newValue(action, a, b) {
  switch (action) {
    case 'give':
      return Number(a) + Number(b);
    case 'take':
      return Number(a) - Number(b);
    case 'set':
      return b;
  }
}

function calculLVL(xp) {
  var lvl = 0;
  var xpMax = 0;

  while (xp >= xpMax) {
    lvl++
    xpMax = (lvl * 10 + 110) * lvl
  }

  return lvl;
}

function calculXP(lvl) {
  xp = (lvl * 10 + 110) * (lvl - 1);

  return xp;
}