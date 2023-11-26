const Canvas = require('@napi-rs/canvas');
const {
  request
} = require('undici');
const moment = require("moment");
const Discord = require('discord.js');
const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = Discord;

module.exports = {
  editProfile: async function (client, interaction) {

  /****** DISABLED CODE ******/
  console.warn("DISABLED CODE. canvasCmd.js:12")
  return;
  /****** DISABLED CODE ******/
    const user = await client.db.users.findOne({ userID: interaction.user.id, guildID: interaction.guild.id }).catch(e => { console.log(e) });
    if (interaction.type === 2) {
      const rows = await createRows(user);
      const attachment = await createCanvas(user);

      interaction.reply({
        components: rows,
        files: [attachment]
      });
    } else {
      if (interaction.message.interaction.user.id != interaction.user.id) return interaction.reply({ content: 'Vous ne pouvez pas intervenir sur la modification de quelqu\'un d\'autre.', ephemeral: true });
      const args = interaction.customId.trim().split('-');

      if (args[1] === "end") return interaction.message.delete();
      if (args[2] === "l") {
        user.profile[args[1]] -= 1
      } else {
        user.profile[args[1]] += 1
      }

      user.save().catch(e => console.log(e));

      const rows = await createRows(user);
      const attachment = await createCanvas(user);

      interaction.deferUpdate();
      interaction.message.edit({
        components: rows,
        files: [attachment]
      });
    }
  },
  sendProfile: async function (client, interaction) {


    const guild = client.guilds.cache.get(interaction.guild.id);
    const user = interaction.options.getUser('utilisateur') ? interaction.guild.members.cache.get(interaction.options.getUser('utilisateur').id) : interaction.member;
    const users = await client.db._makeQuery(`SELECT * FROM users;`)

    const user_db = await client.db.getUser(user.id)

    if(!user_db) {
      return interaction.reply({
        content: `L'utilisateur spécifié n'est pas dans la base de données.`
      })
    }
    
    const member = interaction.guild.members.cache.get(user.id);

    const userDatas = await client.db.getUserDatas(user.id)

    if(!userDatas) {
      return interaction.reply({
        content: `Aucune données pour cet utilisateur.`
      })
    }


    let nextXp = (Number(userDatas.level) * 10 + 110) * Number(userDatas.level);
    let lastXp = ((Number(userDatas.level) - 1) * 10 + 110) * (Number(userDatas.level) - 1);
    let xpPurcent = (Number(userDatas.xp) - lastXp) / (nextXp - lastXp);
    let xpAvance = `${Number(userDatas.xp) - lastXp}/${nextXp - lastXp}`;

    let classement = users.sort(function (a, b) {
      if (a.level === b.level) {
        if(a.xp == b.xp) return 0
        return b.xp > a.xp ? 1 : -1;
      }
      return a.level < b.level ? 1 : -1;
    });
    let classArr = [];
    classement.map(x => {
      const m = guild.members.cache.get(userDatas.user_id);
      if (!m) return;
      classArr.push(userDatas.user_id);
    });
    let N = classArr.indexOf(userDatas.user_id) + 1

    const canvas = Canvas.createCanvas(512, 300);
    const ctx = canvas.getContext('2d');

    const banner = await Canvas.loadImage(`./pictures/profile/banner${userDatas?.profile?.base || 1}.png`)
    ctx.drawImage(banner, 0, 0, 512, 75);

    const base = await Canvas.loadImage(`./pictures/profile/base${userDatas?.profile?.base || 1}.png`)
    ctx.drawImage(base, 0, 0, 512, 300);

    const barres = await Canvas.loadImage('./pictures/profile/barres.png')
    ctx.drawImage(barres, 0, 0, 512, 300);

    const boost = await Canvas.loadImage(member._roles.includes(client.config.static.roles.booster) ? './pictures/profile/boost.png' : './pictures/profile/noBoost.png')
    ctx.drawImage(boost, 382, 91, 28, 28);

    //nickname
    ctx.font = '24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "left";
    ctx.fillText(user.nickname ? user.nickname : member.user.username, 50, 195);

    //username
    ctx.font = '14px Arial';
    ctx.fillStyle = '#949494';
    ctx.textAlign = "left";
    ctx.fillText("@" + member.user.username, 50, 216);

    //XP
    ctx.font = '14px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = "left";
    ctx.fillText(xpAvance + ' XP', 55, 268);

    //ProgressBar

    roundRect(ctx, 50, 227, 412 * xpPurcent, 18, 5);
    ctx.fillStyle = '#DA0000';
    ctx.fill();

    //Rank + level
    ctx.font = '14px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = "right";
    ctx.fillText(`#${N} Lvl ${Number(userDatas.level)}`, 345, 268);
    //Join
    ctx.font = '14px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = "center";
    ctx.fillText(moment(member.joinedTimestamp).locale('fr').format("ll"), 412, 268);

    const white = await Canvas.loadImage(member.roles.cache.has(client.config.static.roles.porte_blanche) ? './pictures/profile/blanc.png' : './pictures/profile/gris.png')
    const black = await Canvas.loadImage(member.roles.cache.has(client.config.static.roles.porte_noire) ? './pictures/profile/noir.png' : './pictures/profile/gris.png')
    const red = await Canvas.loadImage(member.roles.cache.has(client.config.static.roles.porte_rouge) ? './pictures/profile/rouge.png' : './pictures/profile/gris.png')

    ctx.drawImage(white, 424, 95, 85 / 4.2, 105 / 4.2);
    ctx.drawImage(black, 449, 95, 85 / 4.2, 105 / 4.2);
    ctx.drawImage(red, 474, 95, 85 / 4.2, 105 / 4.2);

    ctx.beginPath();
    ctx.arc(112.5, 102.5, 62.5, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = member.avatar ? member.displayAvatarURL({
      extension: 'png'
    }) : member.user.displayAvatarURL({
      extension: 'png'
    });
    var {
      body
    } = await request(avatar)
    const av = await Canvas.loadImage(await body.arrayBuffer());
    ctx.drawImage(av, 50, 40, 125, 125);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), {
      name: 'profile-image.png'
    });

    interaction.reply({
      files: [attachment]
    });
  },
  sendLeaderBoard: async function (client, interaction) {

    try {

        const guild = client.guilds.cache.get(interaction.guild.id);
        //const users = await client.db.users.find({ guildID: interaction.guild.id, isMember: true }).catch(e => { console.log(e) });
        const users = await client.db._makeQuery(`SELECT * from user_stats AS u 
        WHERE u.user_id IN (
            SELECT e.user_id FROM users AS e WHERE isMember=1
        )`, [])

        console.log("users:",users)

        users.sort(function (a, b) {
        if (a.level === b.level) {
            return b.xp > a.xp ? 1 : -1;
        }
        return a.level < b.level ? 1 : -1;
        });

        const top = [];
        var index = 0;

        users.map(async x => {
        const member = guild.members.cache.get(x.user_id);
        if (!member) return;

        top.push({
            name: member.nickname || member.user.username,
            pp: member.avatar ? member.displayAvatarURL({
            extension: 'png'
            }) : member.user.displayAvatarURL({
            extension: 'png'
            }),
            class: index,
            xp: x.xp,
            level: x.level
        });
        index++;
        });

        const maxPage = Math.ceil(top.length / 10);
        var page = 1;

        if (interaction.type === 3) {
        switch (interaction.customId) {
            case "topFirstPage": {
            page = 1
            }
            break
            case "topPastPage": {
            page = parseInt(interaction.message.components[0].components[2].label) - 1
            }
            break
            case "topNextPage": {
            page = parseInt(interaction.message.components[0].components[2].label) + 1
            }
            break
            case "topLastPage": {
            page = maxPage
            }
            break
        }
        }

        const min = (page - 1) * 10;
        const max = page * 10 - 1;
        const n = top.length > page * 10 ? "10" : top.length - (page - 1) * 10;

        const canvas = Canvas.createCanvas(1000, 96 * n);
        const context = canvas.getContext('2d');

        await Promise.all(top.map(async (x, index) => {
        if (x.class < min || x.class > max) return;

        let y = 48 + 96 * String(index).slice(-1);

        // Fond
        const ProgressBar = await Canvas.loadImage('./pictures/fondleader.png');
        context.globalAlpha = 0.5
        context.drawImage(ProgressBar, 0, 8 + 96 * String(index).slice(-1), 1000, 80, 0, 8 + 96 * String(index).slice(-1), 1000, 80);
        context.globalAlpha = 1

        // Rank
        context.font = '42px Gill Sans MT';
        context.fillStyle = '#ffffff';
        context.textAlign = "left";
        context.textBaseline = 'middle';
        context.fillText(`#${x.class + 1}`, 100, y);

        // Nom
        context.font = '42px Gill Sans MT';
        if (x.class === 0) {
            context.fillStyle = '#DA0000'; // Premier 
        } else if (x.class === 1) {
            context.fillStyle = '#f51f23'; // Deuxieme
        } else if (x.class === 2) {
            context.fillStyle = '#dd6767'; // Troisieme
        } else {
            context.fillStyle = '#ffffff';
        }
        context.textAlign = "center";
        context.textBaseline = 'middle';
        context.fillText(`• ${x.name} •`, 500, y);

        // Level
        context.font = '42px Gill Sans MT';
        context.fillStyle = '#ffffff';
        context.textAlign = "right";
        context.textBaseline = 'middle';
        context.fillText(`Lvl. ${x.level}`, 985, y);

        const {
            body
        } = await request(x.pp)
        const pp = await Canvas.loadImage(await body.arrayBuffer());
        context.drawImage(pp, 0, y - 40, 80, 80)
        }));

        const attachment = new AttachmentBuilder(await canvas.encode('png'), {
        name: 'leaderboard.png'
        });

        const embed = new EmbedBuilder()
        .setTitle("Classement le Donjon")
        .setImage('attachment://leaderboard.png')
        .setTimestamp()

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('topFirstPage')
            .setEmoji('⏪')
            .setDisabled(page <= 2 ? true : false)
            .setStyle(page <= 2 ? ButtonStyle.Secondary : ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId('topPastPage')
            .setEmoji('◀️')
            .setDisabled(page == 1 ? true : false)
            .setStyle(page == 1 ? ButtonStyle.Secondary : ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId('topNumber')
            .setLabel(`${page}`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId('topNextPage')
            .setEmoji('▶️')
            .setDisabled(page == maxPage ? true : false)
            .setStyle(page == maxPage ? ButtonStyle.Secondary : ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId('topLastPage')
            .setEmoji('⏩')
            .setDisabled(page >= maxPage - 1 ? true : false)
            .setStyle(page >= maxPage - 1 ? ButtonStyle.Secondary : ButtonStyle.Primary),
        );

        if (interaction.type == 3) {
        try {
            interaction.message.edit({
            components: [row],
            embeds: [embed],
            files: [attachment]
            }).then(async msg => {
            await interaction.deferUpdate()
            })
        } catch (err) { }
        } else {
        interaction.reply({
            components: [row],
            embeds: [embed],
            files: [attachment]
        });
        }

    } catch(e) {
        return interaction.reply({
            embeds: [
            new Discord.EmbedBuilder()
                .setDescription(`Aïe.. une erreur est survenue. \`\`\`js\n${e}\`\`\``)
                .setColor("FF0000")
            ],
            ephemeral: true
        });
    }
  }

}

function roundRect(ctx, x, y, w, h, radius) {
  var r = x + w;
  var b = y + h;
  ctx.beginPath();
  ctx.strokeStyle = "#DA0000";
  ctx.lineWidth = "4";
  ctx.moveTo(x + radius, y);
  ctx.lineTo(r - radius, y);
  ctx.quadraticCurveTo(r, y, r, y + radius);
  ctx.lineTo(r, y + h - radius);
  ctx.quadraticCurveTo(r, b, r - radius, b);
  ctx.lineTo(x + radius, b);
  ctx.quadraticCurveTo(x, b, x, b - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.stroke();
}

async function createRows(user) {
  const row1 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('editP-banner-l')
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(user.profile.banner <= 1 ? true : false),
      new ButtonBuilder()
        .setCustomId('editP-banner-n')
        .setLabel('Bannière ' + user.profile.banner)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('editP-banner-r')
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(user.profile.banner >= 15 ? true : false),
    )

  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('editP-base-l')
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(user.profile.base <= 1 ? true : false),
      new ButtonBuilder()
        .setCustomId('editP-base-n')
        .setLabel('Base ' + user.profile.base)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('editP-base-r')
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(user.profile.base >= 10 ? true : false),
    )

  const row3 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('editP-end')
        .setLabel('Terminé')
        .setStyle(ButtonStyle.Success),
    )

  const rows = [row1, row2, row3];
  return rows;
}

async function createCanvas(user) {
  const canvas = Canvas.createCanvas(512, 300);
  const ctx = canvas.getContext('2d');

  const banner = await Canvas.loadImage(`./pictures/profile/banner${user.profile.banner}.png`)
  ctx.drawImage(banner, 0, 0, 512, 75);

  const base = await Canvas.loadImage(`./pictures/profile/base${user.profile.base}.png`)
  ctx.drawImage(base, 0, 0, 512, 300);

  const barres = await Canvas.loadImage('./pictures/profile/barres.png')
  ctx.drawImage(barres, 0, 0, 512, 300);

  const attachment = new AttachmentBuilder(await canvas.encode('png'), {
    name: 'profile-image.png'
  });

  return attachment;
}