const captcha = require('./captcha');
const { ActionRowBuilder, AttachmentBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType, ImageFormat } = require('discord.js');
const messCooldown = new Set;
const reactCooldown = new Set;
const imgCooldown = new Set;
const checklevelUpCooldown = new Set;


let Temp = {
  userIsMember: []
}

async function user_isMember(guild_id, user_id) {

  // prevents too much requests to database
  let getFromTemp = Temp.userIsMember.find(x => {
    return x.userID == user_id && x.guildID == guild_id
  })

  if(getFromTemp) return getFromTemp.isMember;

  let userIsMember = (await client.db._makeQuery(`SELECT isMember FROM users
    WHERE user_id=? AND guild_id=?`, [
      member.id,
      interaction.guild.id,
    ]))[0].isMember

  Temp.userIsMember.push({
    userID: user_id,
    guildID: guild_id,
    isMember: true,
    lastUpdate: Date.now()
  })

  return userIsMember
}



module.exports = {
  addMess: async function (client, message) {

    if (message.author.bot) return;
    if (message.channel.type === 1 || message.channel.type === 3) return;
    
    let userIsMember = await user_isMember(message.guild.id, message.author.id)
    if(!userIsMember) return;

    if (!messCooldown.has(message.author.id)) {
      messCooldown.add(message.author.id);
      client.db._makeQuery(`UPDATE user_stats
      SET message=message+1, xp=xp+?
      WHERE user_id=? AND guild_id=?`, [
        (client.config.stats.msg.noMic.list.includes(message.channel.name)
        ? client.config.stats.msg.noMic.xp
        : client.config.stats.msg.xp),
        message.user.id,
        message.guild.id
      ])
    } else {
      client.db._makeQuery(`UPDATE user_stats
      SET message=message+1,
      WHERE user_id=? AND guild_id=?`, [
        message.user.id,
        message.guild.id
      ])
    }

    checklevelUp(client, user);

    setTimeout(() => {
      messCooldown.delete(message.author.id);
    }, client.config.stats.msg.cooldown * 1000);
  },
  addReact: async function (client, reaction, reactUser) {

    const channel = client.channels.cache.get(reaction.message.channelId);

    if (reactUser.bot) return;
    if (channel.type === 1 || channel.type === 3) return;

    let userIsMember = await user_isMember(message.guild.id, message.author.id)
    if(!userIsMember) return;

    if (!reactCooldown.has(reactUser.id)) {
      reactCooldown.add(reactUser.id);
      client.db._makeQuery(`UPDATE user_stats
      SET react=react+1, xp=xp+?
      WHERE user_id=? AND guild_id=?`, [
        client.config.stats.react.xp,
        message.user.id,
        message.guild.id
      ])
    } else {
      client.db._makeQuery(`UPDATE user_stats
      SET react=react+1,
      WHERE user_id=? AND guild_id=?`, [
        message.user.id,
        message.guild.id
      ])
    }

    checklevelUp(client, user);

    await user.save().catch(e => console.log(e));

    setTimeout(() => {
      reactCooldown.delete(reactUser.id);
    }, client.config.stats.react.cooldown * 1000);
  },
  addImg: async function (client, message) {


    if (message.author.bot) return;
    if (message.channel.type === 1 || message.channel.type === 3) return;

    let userIsMember = await user_isMember(message.guild.id, message.author.id)
    if(!userIsMember) return;

    if (!imgCooldown.has(message.author.id)) {
      imgCooldown.add(message.author.id);
      client.db._makeQuery(`UPDATE user_stats
      SET img=img+1, xp=xp+?
      WHERE user_id=? AND guild_id=?`, [
        client.config.stats.img.xp,
        message.user.id,
        message.guild.id
      ])
    } else {
      client.db._makeQuery(`UPDATE user_stats
      SET img=img+1,
      WHERE user_id=? AND guild_id=?`, [
        message.user.id,
        message.guild.id
      ])
    }

    checklevelUp(client, user);

    await user.save().catch(e => console.log(e));

    setTimeout(() => {
      imgCooldown.delete(message.author.id);
    }, client.config.stats.img.cooldown * 1000);
  },
  addVoc: function (client) {

    const guild = client.guilds.cache.get(client.config.getCurrentGuildID());

    guild.voiceStates.cache.map(async x => {
      if (x.channelId === null) return;
      if (x.channelId === guild.afk_channel_id) return;

      const voiceChannel = await guild.channels.fetch(x.channelId, {
        force: true
      });

      var n = 2
      voiceChannel.members.map(x => {
        if (x.user.bot)
          n++
      });

      if (voiceChannel.members.size < n) return;

      const user = await client.db.users.findOne({
        userID: x.id,
        guildID: guild.id
      }).catch(e => { });

      if (!user) return; // if (!user || !user?.isMember) return;

      const member = guild.members.cache.get(x.id);

      let voiceChannelInConfig = client.config.static.voiceChannels.find(x => {
        return x.id == x.channelId
      })

      if ((voiceChannelInConfig ? voiceChannelInConfig.canEarnXP : true) && !x.selfMute && !x.selfDeaf && !x.serverDeaf && !x.serverMute && user.stats.lvl >= 10) {
        if (member._roles.includes(client.config.static.roles.porte_noire) || member._roles.includes(client.config.static.roles.porte_rouge)) {
          client.db._makeQuery(`UPDATE user_stats
          SET minutesInVoice=minutesInVoice+1, xp=xp+?
          WHERE user_id=? AND guild_id=?`, [
            client.config.stats.voc.xpBlack,
            message.user.id,
            message.guild.id
          ])
        } else {
          client.db._makeQuery(`UPDATE user_stats
          SET minutesInVoice=minutesInVoice+1, xp=xp+?
          WHERE user_id=? AND guild_id=?`, [
            client.config.stats.voc.xpElse,
            message.user.id,
            message.guild.id
          ])
        }
      } else {
        client.db._makeQuery(`UPDATE user_stats
        SET minutesInVoice=minutesInVoice+1`, [
          client.config.stats.voc.xpElse,
          message.user.id,
          message.guild.id
        ])
      }
      
      checklevelUp(client, user);

      await user.save().catch(e => console.log(e));
    });
  },
  inviteBonus: async function (client, userID) {
    console.log('test')

  },
  createUser: async function (client, member, inviter) {


    /****** DISABLED CODE ******/
    console.warn("DISABLED CODE. userStats.js:177")
    return;
    /****** DISABLED CODE ******/


    const user = await client.db.users.findOne({
      userID: member.user.id,
      guildID: member.guild.id
    }).catch(e => { });

    if (!user) {
      const newUser = new client.db.users({
        userID: member.user.id,
        guildID: member.guild.id,
        invitedBy: inviter,
        join: {
          joinedAt: Date.now(),
        }
      });

      await newUser.save().catch(e => { console.log(e) });
    } else {
      user.join.joinedAt = Date.now();
      user.join.captchedAt = null;
      user.join.validedAt = null;
      user.join.ticketID = null;

      await user.save().catch(e => { console.log(e) });
    }

    captcha.create(client, member);
  }
};

async function checklevelUp(client, user) {


  if (checklevelUpCooldown.has(user.userID)) return;
  checklevelUpCooldown.add(user.userID);

  const xpMax = (user.stats.lvl * 10 + 110) * user.stats.lvl;

  if (user.stats.xp > xpMax) {
    client.db._makeQuery(`UPDATE user_stats
    SET level=level+1, xp=xp+?
    WHERE user_id=? AND guild_id=?`, [
      client.config.stats.voc.xpElse,
      message.user.id,
      message.guild.id
    ])

    levelUp(client, user.userID, user.stats.lvl)
  }

  setTimeout(() => {
    checklevelUpCooldown.delete(user.userID);
  }, 5000);
}

async function levelUp(client, userID, lvl) {


  const guild = client.guilds.cache.get(client.config.getCurrentGuildID());
  const channel = guild.channels.cache.get(client.config.static.roles.level_up);
  const member = guild.members.cache.get(userID) || null;
  if (!member) return;

  let dessc = await getDesc(member._roles, client.config.stats.lvlUpDesc, client.desc, lvl);

  /*
  if (lvl === 18 && !member.roles.cache.has('1094318706378682384')) {
    member.roles.add('1094318706378682384');
  }
  if (lvl === 30 && !member.roles.cache.has('1094318706403836059')) {
    member.roles.add('1094318706403836059');
  };
  */

  const embed = new EmbedBuilder()
    .setTitle(`**${member.user.username}** 🎖️**${lvl}**`)
    .setDescription(dessc.replace(/\$level/g, lvl).replace(/\$pseudo/g, member))
    .setThumbnail(member.displayAvatarURL({
      size: 2048,
      dynamic: true,
      format: "png"
    }));

  channel.send({
    content: `${member}`,
    embeds: [embed]
  });
}

async function getDesc(roles, config, desc, lvl) {


  //Bypass
  if (roles.some(element => {
    return config.roles.generic.includes(element)
  })) {
    return getDesc2(desc, "generic", lvl);
  }

  //Genre
  var genre;
  if (roles.includes(config.roles.il)) {
    genre = "Il";
  } else if (roles.includes(config.roles.elle)) {
    genre = "Elle";
  } else {
    return getDesc2(desc, "generic", lvl);
  }

  //Roles Bdsm
  if (roles.includes(config.roles.switch)) {
    return getDesc2(desc, "switch", lvl, genre);
  } else {
    if (roles.some(element => {
      return config.roles.dom.includes(element)
    }) && roles.some(element => {
      return config.roles.sub.includes(element)
    })) {
      return getDesc2(desc, "switch", lvl, genre);
    } else if (roles.some(element => {
      return config.roles.dom.includes(element)
    })) {
      return getDesc2(desc, "dom", lvl, genre)
    } else if (roles.some(element => {
      return config.roles.sub.includes(element)
    })) {
      return getDesc2(desc, "sub", lvl, genre)
    } else {
      return getDesc2(desc, "generic", lvl);
    }
  }
}

async function getDesc2(desc, key, lvl, genre) {
  if (key === "switch") {
    if (Math.random() < 0.5) {
      key = "dom";
    } else {
      key = "sub";
    }
  }

  if (genre)
    key = key + genre;

  if (desc[key].level[lvl])
    return desc[key].level[lvl];

  return desc[key].random[Math.floor(Math.random() * desc[key].random.length)];
}