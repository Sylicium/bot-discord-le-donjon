const captcha = require('./captcha');
const { ActionRowBuilder, AttachmentBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const messCooldown = new Set;
const reactCooldown = new Set;
const imgCooldown = new Set;
const checklevelUpCooldown = new Set;

module.exports = {
  addMess: async function (client, message) {


  /****** DISABLED CODE ******/
  console.warn("DISABLED CODE. userStats.js:13")
  return;
  /****** DISABLED CODE ******/

    if (message.author.bot) return;
    if (message.channel.type === 1 || message.channel.type === 3) return;

    const user = await client.db.users.findOne({
      userID: message.author.id,
      guildID: message.guild.id
    }).catch(e => { });

    if (!user) return; // if (!user || !user?.isMember) return;

    user.stats.msgs[0]++;
    user.stats.msg++;

    if (!messCooldown.has(message.author.id)) {
      messCooldown.add(message.author.id);
      user.stats.xp += client.config.stats.msg.noMic.list.includes(message.channel.name)
        ? client.config.stats.msg.noMic.xp
        : client.config.stats.msg.xp;
    }

    checklevelUp(client, user);

    await user.save().catch(e => console.log(e));

    setTimeout(() => {
      messCooldown.delete(message.author.id);
    }, client.config.stats.msg.cooldown * 1000);
  },
  addReact: async function (client, reaction, reactUser) {


    /****** DISABLED CODE ******/
    console.warn("DISABLED CODE. userStats.js:49")
    return;
    /****** DISABLED CODE ******/


    const channel = client.channels.cache.get(reaction.message.channelId);

    if (reactUser.bot) return;
    if (channel.type === 1 || channel.type === 3) return;

    const user = await client.db.users.findOne({
      userID: reactUser.id,
      guildID: reaction.message.guildId
    }).catch(e => { });

    if (!user) return; // if (!user || !user?.isMember) return;

    user.stats.reacts[0]++;
    user.stats.react++;


    if (!reactCooldown.has(reactUser.id)) {
      reactCooldown.add(reactUser.id);
      user.stats.xp += client.config.stats.react.xp;
    }

    checklevelUp(client, user);

    await user.save().catch(e => console.log(e));

    setTimeout(() => {
      reactCooldown.delete(reactUser.id);
    }, client.config.stats.react.cooldown * 1000);
  },
  addImg: async function (client, message) {

  /****** DISABLED CODE ******/
  console.warn("DISABLED CODE. userStats.js:86")
  return;
  /****** DISABLED CODE ******/


    if (message.author.bot) return;
    if (message.channel.type === 1 || message.channel.type === 3) return;

    const user = await client.db.users.findOne({
      userID: message.author.id,
      guildID: message.guild.id
    }).catch(e => { });

    if (!user) return; // if (!user || !user?.isMember) return;

    user.stats.imgs[0]++;
    user.stats.img++;

    if (!imgCooldown.has(message.author.id)) {
      imgCooldown.add(message.author.id);
      user.stats.xp += client.config.stats.img.xp;
    }

    checklevelUp(client, user);

    await user.save().catch(e => console.log(e));

    setTimeout(() => {
      imgCooldown.delete(message.author.id);
    }, client.config.stats.img.cooldown * 1000);
  },
  addVoc: function (client) {


    /****** DISABLED CODE ******/
    console.warn("DISABLED CODE. userStats.js:121")
    return;
    /****** DISABLED CODE ******/


    const guild = client.guilds.cache.get('1094318705883762719');

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

      const member = guild?.members?.cache?.get(x.id);

      if (!['1151950733739044916', '1156641125294161920'].includes(x.channelId) && !x.selfMute && !x.selfDeaf && !x.serverDeaf && !x.serverMute && user.stats.lvl >= 10) {
        if (member?._roles?.includes('1094318706403836057')) {
          user.stats.xp += client.config.stats.voc.xpBlack;
        } else {
          user.stats.xp += client.config.stats.voc.xpElse;
        }
      }

      user.stats.vocs[0]++;
      user.stats.voc++;

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

  /****** DISABLED CODE ******/
  console.warn("DISABLED CODE. userStats.js:214")
  return;
  /****** DISABLED CODE ******/


  if (checklevelUpCooldown.has(user.userID)) return;
  checklevelUpCooldown.add(user.userID);

  const xpMax = (user.stats.lvl * 10 + 110) * user.stats.lvl;

  if (user.stats.xp > xpMax) {
    user.stats.lvl++
    levelUp(client, user.userID, user.stats.lvl)
  }

  setTimeout(() => {
    checklevelUpCooldown.delete(user.userID);
  }, 5000);
}

async function levelUp(client, userID, lvl) {


  /****** DISABLED CODE ******/
  console.warn("DISABLED CODE. userStats.js:238")
  return;
  /****** DISABLED CODE ******/


  const guild = client?.guilds?.cache?.get('1094318705883762719');
  const channel = guild?.channels?.cache?.get('1094318707678904384');
  const member = guild?.members?.cache?.get(userID) || null;
  if (!member) return;

  let dessc = await getDesc(member._roles, client.config.stats.lvlUpDesc, client.desc, lvl);

  if (lvl === 18 && !member.roles.cache.has('1094318706378682384')) {
    member.roles.add('1094318706378682384');
  }
  if (lvl === 30 && !member.roles.cache.has('1094318706403836059')) {
    member.roles.add('1094318706403836059');
  };

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


  /****** DISABLED CODE ******/
  console.warn("DISABLED CODE. userStats.js:276")
  return;
  /****** DISABLED CODE ******/



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