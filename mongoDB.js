const { Schema, model } = require("mongoose");

const users = Schema({
  userID: String,
  guildID: String,
  invitedBy: String,
  isLeaved: { type: Boolean, default: 0 },
  isMember: { type: Boolean, default: 0 },
  leaveAt: { type: Date, default: null },
  profile: {
    banner: { type: Number, default: 1 },
    base: { type: Number, default: 1 },
  },
  join: {
    captchedAt: Date,
    joinedAt: Date,
    ticketID: String,
    validedAt: Date,
  },
  stats: {
    bonus: { type: Number, default: 0 },
    img: { type: Number, default: 0 },
    imgs: { type: Array, default: [0] },
    lvl: { type: Number, default: 1 },
    msg: { type: Number, default: 0 },
    msgs: { type: Array, default: [0] },
    react: { type: Number, default: 0 },
    reacts: { type: Array, default: [0] },
    voc: { type: Number, default: 0 },
    vocs: { type: Array, default: [0] },
    xp: { type: Number, default: 0 },
  }
});

const guilds = Schema({
  guildID: String,
  stats: {
    genre: {
      0: {
        msgs: { type: Array, default: [0] },
        vocs: { type: Array, default: [0] },
      }, // Femme
      1: {
        msgs: { type: Array, default: [0] },
        vocs: { type: Array, default: [0] },
      }, // Mtf
      2: {
        msgs: { type: Array, default: [0] },
        vocs: { type: Array, default: [0] },
      }, // Else
      3: {
        msgs: { type: Array, default: [0] },
        vocs: { type: Array, default: [0] },
      }, // Ftm
      4: {
        msgs: { type: Array, default: [0] },
        vocs: { type: Array, default: [0] },
      } // Homme
    },
    age: {
      0: {
        msgs: { type: Array, default: [0] },
        vocs: { type: Array, default: [0] },
      }, // 18-24 ans
      1: {
        msgs: { type: Array, default: [0] },
        vocs: { type: Array, default: [0] },
      }, // 25-30 ans
      2: {
        msgs: { type: Array, default: [0] },
        vocs: { type: Array, default: [0] },
      }, // 31-35 ans
      3: {
        msgs: { type: Array, default: [0] },
        vocs: { type: Array, default: [0] },
      }, // 36-40 ans
      4: {
        msgs: { type: Array, default: [0] },
        vocs: { type: Array, default: [0] },
      } // 41 et plus
    }
  }
});

module.exports = {
  users: model('users', users),
  guilds: model('guilds', guilds)
};
