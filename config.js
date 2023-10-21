try {
  require("dotenv").config()
} catch(e) { console.log(e) }

let START_MODE = 2 // 1: Dév | 2: Production

function getToken() {
  return START_MODE == 1 ? process.env.TOKEN_TEST : process.env.TOKEN_PROD
}

function getCurrentGuildID() { return CONFIG.guildId[START_MODE] }

let CONFIG = {
  token: getToken(), // Le Donjon
  startMode: START_MODE,
  clientId: {
    "1": "1160565576461209700",
    "2": "1160598942044672000"
  },
  guildId: {
    "1": "1160467551252385852",
    "2": "1094318705883762719"
  },
  getCurrentGuildID: () => { return getCurrentGuildID() },
  mongodbURL: process.env.MONGODB_URL,
  stats: {
    img: {
      cooldown: 120, // Seconde d'attente pour le gain d'XP lors d'envois d'image
      xp: 4 // XP gagné par Image
    },
    msg: {
      blackList: ["1124119849191358574"], //Channels blacklist pour le lvlUP (Si tu pouvais le mettre avec le nouveau code, ça serait génial) "1094318711202140253",
      cooldown: 60, // Seconde d'attente pour le gain d'XP lors d'envois de messages
      noMic: {
        list: ["🔉╏salle-d’audience", "🍑╏discu-a-theme-bdsm", "⚪╏salle-à-manger", "⚪╏love-room", "⚫╏sanctuaire", "🔴╏chenils", "🦋╏cocoon", "jeux-vidéos"], // liste des channels nomics
        xp: 1 // XP gagné par message dans les nomics
      },
      xp: 4 // XP gagné par message
    },
    react: {
      cooldown: 120, // Seconde d'attente pour le gain d'XP lors d'envois de réactions
      xp: 4 // XP gagné par réaction
    },
    voc: {
      xpElse: 2, // XP pour les membres non chambre noire
      xpBlack: 4 // XP pour les membres de la chambre noire
    },
    lvlUpDesc: { // Pour les descriptions personnalisée en fonction des rôles.
      roles: {
        generic: ["1094318706198327390"],
        dom: ["1094318706038951946", "1094318706038951945", "1094318706038951944"],
        sub: ["1094318706038951942", "1094318706038951941", "1094318706038951943"],
        switch: "1094318706038951940",
        il: "1094318706198327391",
        elle: "1094318706198327389"
      }
    }
  },
  static: {
    emojis: {
      loading: {
        tag: "<a:loading:1161357384682307615>"
      }
    },
    users: {
      seikam: "467333274314997760"
    },
    logChannels: {
      global: "1160246355927773235",
      voice: "1160246392736977046",
      messages: "1160246355927773235",
      channelUpdate: "1160246355927773235",
      tickets: "1160342857840869456",
      welcome: "1160246474517512292",
      logs_categoryID: "1159893939873136781",
    },
    channels: {
      welcome: "1159895213578399885",
      verification: "1160239538506047507",
      chambre_blanche: "1160233330474758204",
      chambre_noire: "1160233656984551506",
      chambre_rouge: "1164887556077408327",
      selectRoles: "1159894126607740968",
      ban_pilori: "1159895318440202433"
    },
    voiceChannels: {
    },
    roles: {
      nonVerifie: "1160239536975118436",
      captcha: "1160238993020043364",
      luEtApprouve: "1159934558679076936",
      tampon: "1159934688194994308",
      porte_blanche: "1159950689355694132",
      porte_noire: "1159950621160525854",
      porte_rouge: "1160165910510845992",
    },
    voiceChannels: [
      {
        id: "1161068132484526081",
        whitelistCamera: true
      },
      {
        id: "1161066757881069568",
        whitelistCamera: true
      },
      {
        id: "1162498653617934376",
        whitelistCamera: true
      },
      {
        id: "1160282909480079400",
        whitelistCamera: true
      }
    ]
  },
  rolesChambre: [
    {
      niveau: 0,
      name: "Chambre blanche",
      roleID: "1160467551403393049"
    },
    {
      niveau: 1,
      name: "Chambre noire",
      roleID: "1160467551403393051"
    },
    {
      niveau: 2,
      name: "Chambre rouge",
      roleID: "1160467551403393053"
    },
  ],
  tempResetChan: "1", //Minutes pour reset le channel écris lié aux channels.
  vocs: [{
    chan: "1094318707930583085", 
    role: "1094318705883762727",
    noMic: "🔉╏𝚂𝚊𝚕𝚕𝚎-𝚍’𝚊𝚞𝚍𝚒𝚎𝚗𝚌𝚎"
  }, {
    chan: "1094318707930583086",
    role: "1094318705883762726",
    noMic: "🍑╏𝙳𝚒𝚜𝚌𝚞-𝚊-𝚝𝚑𝚎𝚖𝚎-𝚋𝚍𝚜𝚖"
  }, {
    chan: "1127191202165440643",
    role: "1094318705883762725",
    noMic: "⚪╏𝚂𝚊𝚕𝚕𝚎-𝚊̀-𝚖𝚊𝚗𝚐𝚎𝚛"
  }, {
    chan: "1094318708425490511", 
    role: "1094318705883762724",
    noMic: "⚪╏𝙻𝚘𝚟𝚎-𝚛𝚘𝚘𝚖"
  }, 
  // {
  //   chan: "1141490773049745488",
  //   role: "1148804474056495124",
  //   noMic: "⚫╏𝙰𝚌𝚝𝚒𝚘𝚗-𝚘𝚞-𝚟𝚎́𝚛𝚒𝚝𝚎́"
  // }, 
  {
    chan: "1127670087453777960",
    role: "1094318705883762723", 
    noMic: "⚫╏𝚂𝚊𝚗𝚌𝚝𝚞𝚊𝚒𝚛𝚎"
  }, {
    chan: "1094318709209837599",
    role: "1094318705883762722",
    noMic: "🔴╏𝙲𝚑𝚎𝚗𝚒𝚕𝚜"
  }, {
    chan: "1128365806871400459", 
    role: "1128365219303923782",
    noMic: "🦋╏𝙲𝚘𝚌𝚘𝚘𝚗"
  }],
  chanStats: [ ],
  roles: [{
    name: "genre",
    type: 3,
    picture: "01-genre.png",
    embed: [{
      color: '',
      roles: [{
        desc: "Femme",
        emoji: "<:role_F:1160178010641678376> ",
        role: "1159937649847582833"
      }, {
        desc: "MTF",
        emoji: "<:role_MtF:1160178017386119188>",
        role: "1159950187620466890"
      }, {
        desc: "Autre(s) ",
        emoji: "<:role_NB:1160178018963181649> ",
        role: "1159938917932478525"
      }, {
        desc: "FTM",
        emoji: "<:role_FtM:1160178012759785515>",
        role: "1159950299742609438"
      }, {
        desc: "Homme",
        emoji: "<:role_M:1160178014752079882>",
        role: "1159938789112823860"
      }]
    }]
  }, {
    name: "pronom",
    type: 3,
    picture: "02-pronom.png",
    embed: [{
      color: '',
      roles: [{
        desc: "Elle",
        emoji: "<:elle:1160189693745430598>",
        role: "1159935784523153479"
      }, {
        desc: "Iel",
        emoji: "<:iel:1160189696274612364>",
        role: "1159935499893489744"
      }, {
        desc: "Il",
        emoji: "<:il:1160189697881014282>",
        role: "1159934859247104161"
      }]
    }]
  }, {
    name: "age",
    type: 2,
    picture: "03-age.png",
    embed: [{
      color: 'FF0000',
      roles: [{
        desc: "18-24 ans",
        emoji: "👧",
        role: "1159941097699692564"
      }, {
        desc: "25-30 ans",
        emoji: "👦",
        role: "1159933053800550470"
      }, {
        desc: "31-35 ans",
        emoji: "👩",
        role: "1159933316506603550"
      }, {
        desc: "36-40 ans",
        emoji: "🧑",
        role: "1159933161959067759"
      }, {
        desc: "41 et plus",
        emoji: "🧓",
        role: "1159934198400958475"
      }]
    }]
  }, {
    name: "situation",
    type: 1,
    picture: "04-situation.png",
    embed: [{
      color: '',
      roles: [{
        desc: "En Couple",
        emoji: "❤️",
        role: "1159933544047591504"
      }, {
        desc: "Célibataire",
        emoji: "💔",
        role: "1159936494530723870"
      }, {
        desc: "Compliqué",
        emoji: "🤍",
        role: "1159936494530723870"
      }, {
        desc: "Relation Libre",
        emoji: "💯",
        role: "1159951312658645002"
      }, {
        desc: "Relation Polyamoureuse",
        emoji: "💘",
        role: "1159943088882593823"
      }]
    }, {
      color: '',
      roles: [{
        desc: "Relation D/S",
        emoji: "<:d_s:1160238721325617254>",
        role: "1159943158524809216"
      }, {
        desc: "Relation M/E",
        emoji: "<:m_e:1160238726702698516>",
        role: "1159943312795512974"
      }, {
        desc: "Sous protection",
        emoji: "<:protection:1160238728762106016>",
        role: "1159943438351994890"
      }, {
        desc: "Sous Contrat",
        emoji: "📃",
        role: "1159942064147017830"
      }, {
        desc: "Sous Collier",
        emoji: "📿",
        role: "1159942246599229510"
      }]
    }]
  }, {
    name: "orientation",
    type: 1,
    picture: "05-orientation.png",
    embed: [{
      color: '',
      roles: [{
        desc: "Hétérosexuel.le",
        emoji: "💑",
        role: "1159942632231936080"
      }, {
        desc: "Homosexuel.le",
        emoji: "🌈",
        role: "1159942817750200351"
      }, {
        desc: "Bisexuel.le",
        emoji: "<:bi:1160257466811043870>",
        role: "1159942903947333682"
      }]
    }, {
      color: '',
      roles: [{
        desc: "Pansexuel.le",
        emoji: "💕",
        role: "1159948087448571944"
      }, {
        desc: "Asexuel.le",
        emoji: "❣️",
        role: "1159947091863408700"
      }, {
        desc: "Autre",
        emoji: "❓",
        role: "1159947158439612567"
      }]
    }]
  }, {
    name: "mp",
    type: 2,
    picture: "06-mp.png",
    embed: [{
      color: '',
      roles: [{
        desc: "Sur demande",
        emoji: "<:MP_demande:1160184316807098399>",
        role: "1159947318930444328"
      }, {
        desc: "Fermés",
        emoji: "<:MP_dtc:1160184366786416721>",
        role: "1159951382216966214"
      }]
    }]
  }, {
    name: "bdsm",
    type: 1,
    picture: "07-bdsm.png",
    embed: [{
      color: '',
      roles: [{
        desc: "Dominant.e",
        emoji: "<:Dom:1160184304232562790>",
        role: "1159947481535238315"
      }, {
        desc: "Maître.sse",
        emoji: "<:Master:1160184307944521789>",
        role: "1159951638526689372"
      }, {
        desc: "Brat tamer",
        emoji: "<:BT:1160184303288852520>",
        role: "1159951902092570745"
      },
      {
        desc: "Daddy-Mommy",
        emoji: "<:DS:1160184299203596329>",
        role: "1159951972598820985"
      }]
    }, {
      color: '',
      roles: [{
        desc: "Soumis.e",
        emoji: "<:Sub:1160184310293344296>",
        role: "1159951823143190549"
      }, {
        desc: "Esclave",
        emoji: "<:Slave:1160184306585587803>",
        role: "1159950965672247326"
      }, {
        desc: "Brat",
        emoji: "<:brat:1160184301082656809>",
        role: "1159951745099776182"
      }, {
        desc: "Little",
        emoji: "<:little:1160184315007742075>",
        role: "1159951054893486122"
      }]
    }, {
      color: '',
      roles: [{
        desc: "Switch",
        emoji: "<:Switch:1160184311715205180>",
        role: "1159954472991203390"
      }, {
        desc: "Ageplay",
        emoji: "<a:ageplay:1160267570583195748>",
        role: "1159955220248412231"
      }, {
        desc: "Petplay",
        emoji: "<a:patoune5:1159892429948846090>",
        role: "1159955868134162542"
      }, {
        desc: "En questionnement",
        emoji: "<:en_questionnement:1160238725071126618>",
        role: "1159956125635063828"
      }, {
        desc: "Vanilla",
        emoji: "<:Vanilla:1160184313086738492>",
        role: "1159956237711065110"
      }]
    }]
  }, {
    name: "kn",
    type: 2,
    picture: "08-KN.png",
    embed: [{
      color: 'FF0000',
      roles: [{
        desc: "Novice",
        emoji: "<:KN1:1160184615055667231>",
        role: "1159956348482625647"
      }, {
        desc: "Amateur",
        emoji: "<:KN2:1160184616326533160>",
        role: "1159956580821901390"
      }, {
        desc: "Confirmé",
        emoji: "<:KN3:1160184618406916106>",
        role: "1159956799777144832"
      }, {
        desc: "Expérimenté",
        emoji: "<:KN4:1160184619958804550>",
        role: "1159956863085985832"
      }]
    }]
  }, {
    name: "xp",
    type: 2,
    picture: "09-XP.png",
    embed: [{
      color: 'FF0000',
      roles: [{
        desc: "Novice",
        emoji: "<:XP1:1160184647066591353>",
        role: "1159956957164208168"
      }, {
        desc: "Amateur",
        emoji: "<:XP2:1160184649386049538>",
        role: "1159957178728321034"
      }, {
        desc: "Confirmé",
        emoji: "<:XP3:1160184651311230976>",
        role: "1159957295548076162"
      }, {
        desc: "Expérimenté ",
        emoji: "<:XP4:1160184653563576390>",
        role: "1159957420324433970"
      }]
    }]
  }, {
    name: "xv",
    type: 2,
    picture: "10-XV.png",
    embed: [{
      color: '',
      roles: [{
        desc: "Novice",
        emoji: "<:XV1:1160184681531183224>",
        role: "1159957557058752532"
      }, {
        desc: "Amateur",
        emoji: "<:XV2:1160184683758370846>",
        role: "1159957669763887135"
      }, {
        desc: "Confirmé",
        emoji: "<:XV3:1160184685297676358>",
        role: "1159957779340070923"
      }, {
        desc: "Expérimenté",
        emoji: "<:XV4:1160184686438527017>",
        role: "1159958446163120269"
      }]
    }]
  }, {
    name: "animation",
    type: 1,
    picture: "ping_animations.png",
    embed: [{
      color: '',
      roles: [{
        desc: "Animations",
        emoji: "♠",
        role: "1160169630015426631"
      },{
        desc: "Partenariat",
        emoji: "🤝",
        role: "1160169655164473416"
      },
      {
        desc: "Gaming",
        emoji: "🎮",
        role: "1160169712978755614"
      }]
    }]
  }, {
    name: "role-member",
    type: 3,
    picture: "12-membre.png",
    embed: [{
      color: '',
      roles: [{
        desc: "Membre",
        emoji: "<a:stark:1160481171596120094>",
        role: "1159856520289341480"
      }]
    }]
  }, {
    name: "relgement",
    type: 3,
    embed: [{
      color: '',
      roles: [{
        desc: "lu et approuvé",
        emoji: "<a:check:1162660402145017926>",
        role: "1159934558679076936"
      }]
    }]
  },{
    name: "régression",
    type: 3,
    embed: [{
      color: '',
      roles: [{
        desc: "J'accepte le règlement",
        emoji: "<a:bibi:1160994479369621504>",
        role: "1160230257148841984"
      }]
    }]
  }, {
    name: "action-verite",
    type: 3,
    embed: [{
      color: '',
      roles: [{
        desc: "Prenez ce rôle uniquement si vous voulez accéder à action ou vérité",
        emoji: "<:action_verite:1143155367765876737>",
        role: "1143150582526378044"
      }]
    }]
  }, {
    name: "culot",
    type: 3,
    embed: [{
      color: '',
      roles: [{
        desc: "Prenez ce rôle uniquement si vous voulez accéder culot",
        emoji: "<:fuck:1104154757565784134>",
        role: "1158679830464835615"
      }]
    }]
  }]
}
module.exports = CONFIG