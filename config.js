module.exports = {
  token: "MTE2MDU2NTU3NjQ2MTIwOTcwMA.Gpgk_s.6Koq3zpavbD6GnluCpTeCWZ1KJAJ4_sZ-oJMos", // Le Donjon
  // token: "MTA1MDgxNTU3MTkzMzAwMzg2Ng.GgK1xR.RIffZhYIdqVEvPh-oCjhMwmHyi4l5oZXqpOoCc", // Donjon Test
  mongodbURL: "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0",
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
        emoji: "<:femme:1101955481079119982>",
        role: "1094318706198327397"
      }, {
        desc: "MTF",
        emoji: "<:MtF:1101956792323420261>",
        role: "1094318706198327396"
      }, {
        desc: "Autre(s) genre(s) ",
        emoji: "<:autresgenres:1101956231826002040>",
        role: "1094318706198327395"
      }, {
        desc: "FTM",
        emoji: "<:FtM:1101956369608872117>",
        role: "1094318706198327394"
      }, {
        desc: "Homme",
        emoji: "<:homme:1101955613296173078>",
        role: "1094318706198327393"
      }]
    }]
  }, {
    name: "pronom",
    type: 3,
    picture: "02-pronom.png",
    embed: [{
      color: '',
      roles: [{
        desc: "Il",
        emoji: "<:il:1101961568259932161>",
        role: "1094318706198327391"
      }, {
        desc: "Iel",
        emoji: "<:iel:1101961481437839361>",
        role: "1094318706198327390"
      }, {
        desc: "Elle",
        emoji: "<:elle:1101967603678838804>",
        role: "1094318706198327389"
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
        role: "1094318706168975428"
      }, {
        desc: "25-30 ans",
        emoji: "👦",
        role: "1094318706168975427"
      }, {
        desc: "31-35 ans",
        emoji: "👩",
        role: "1094318706168975426"
      }, {
        desc: "36-40 ans",
        emoji: "🧑",
        role: "1094318706168975425"
      }, {
        desc: "41 et plus",
        emoji: "🧓",
        role: "1094318706168975424"
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
        role: "1094318706168975421"
      }, {
        desc: "Célibataire",
        emoji: "💔",
        role: "1094318706168975420"
      }, {
        desc: "Compliqué",
        emoji: "🤍",
        role: "1094318706131206284"
      }, {
        desc: "Relation Libre",
        emoji: "💯",
        role: "1094318706131206283"
      }, {
        desc: "Relation Polyamoureuse",
        emoji: "<:crying:1101962019608985610>",
        role: "1094318706131206282"
      }]
    }, {
      color: '',
      roles: [{
        desc: "Relation D/S",
        emoji: "<:DS:1101963377766584370>",
        role: "1094318706131206281"
      }, {
        desc: "Relation M/E",
        emoji: "<:ME:1101963504099000330>",
        role: "1094318706131206280"
      }, {
        desc: "Sous protection",
        emoji: " <:sous_protection:1101963629500305528>",
        role: "1094318706131206279"
      }, {
        desc: "Sous Contrat",
        emoji: "<:plume:1101962956855591013>",
        role: "1094318706131206278"
      }, {
        desc: "Sous Collier",
        emoji: "📿",
        role: "1094318706131206277"
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
        role: "1094318706131206275"
      }, {
        desc: "Homosexuel.le",
        emoji: "🌈",
        role: "1094318706068304072"
      }, {
        desc: "Bisexuel.le",
        emoji: "<:bi:1104154777702641765>",
        role: "1094318706068304071"
      }]
    }, {
      color: '',
      roles: [{
        desc: "Pansexuel.le",
        emoji: "💕",
        role: "1094318706068304070"
      }, {
        desc: "Asexuel.le",
        emoji: "❣️",
        role: "1094318706068304069"
      }, {
        desc: "Autre",
        emoji: "❓",
        role: "1094318706068304068"
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
        emoji: "<:demandes_mp:1101953987307130890>",
        role: "1094318706068304065"
      }, {
        desc: "Fermés",
        emoji: "<:mp_fermes:1101957527974969465> ",
        role: "1094318706068304064"
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
        emoji: "<:dom:1101953539795845200>",
        role: "1094318706038951946"
      }, {
        desc: "Maître.sse",
        emoji: "<:maitre:1101953282806644796>",
        role: "1094318706038951945"
      }, {
        desc: "Brat tamer",
        emoji: "<:brattamer:1101953088560050318>",
        role: "1094318706038951944"
      },
      {
        desc: "Daddy-Mommy",
        emoji: "<:daddy_mommy:1123326801456926720>",
        role: "1117892878740496465"
      }]
    }, {
      color: '',
      roles: [{
        desc: "Soumis.e",
        emoji: "<:sub:1101953663439745064>",
        role: "1094318706038951942"
      }, {
        desc: "Esclave",
        emoji: "<:esclave:1101953438142701778>",
        role: "1094318706038951941"
      }, {
        desc: "Brat",
        emoji: "<:brat:1101953177932288051>",
        role: "1094318706038951943"
      }, {
        desc: "Little",
        emoji: "<:little:1123333062290313226>",
        role: "1117892929512546324"
      }]
    }, {
      color: '',
      roles: [{
        desc: "Switch",
        emoji: "<:switch:1132936711706517504>",
        role: "1094318706038951940"
      }, {
        desc: "Ageplay",
        emoji: "<a:ageplay:1104138280695513148>",
        role: "1094318706038951939"
      }, {
        desc: "Petplay",
        emoji: "<a:la_pate_de_SEIKAM:1104137999832326277>",
        role: "1094318706038951938"
      }, {
        desc: "En questionnement",
        emoji: " <:en_questionnement:1101967712240009236>",
        role: "1094318706038951937"
      }, {
        desc: "Vanilla",
        emoji: " <:vanilla:1101952950638759986>",
        role: "1094318705996988617"
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
        emoji: "<:KN1:1103353399627489504>",
        role: "1094318705996988615"
      }, {
        desc: "Amateur",
        emoji: "<:KN2:1103353402118918164>",
        role: "1094318705996988614"
      }, {
        desc: "Confirmé",
        emoji: "<:KN3:1103353403700158524>",
        role: "1094318705996988613"
      }, {
        desc: "Expérimenté ",
        emoji: "<:KN4:1103353404681629750>",
        role: "1094318705996988612"
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
        emoji: "<:XP1:1103353406975918301>",
        role: "1094318705996988610"
      }, {
        desc: "Amateur",
        emoji: "<:XP2:1103353408301322270>",
        role: "1094318705996988609"
      }, {
        desc: "Confirmé",
        emoji: "<:XP3:1103353410620764261> >",
        role: "1094318705996988608"
      }, {
        desc: "Expérimenté ",
        emoji: "<:XP4:1103353412038430741>",
        role: "1094318705967640605"
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
        emoji: "<:XV1:1103353413477085287>",
        role: "1094318705967640603"
      }, {
        desc: "Amateur",
        emoji: "<:XV2:1103353415364530236>",
        role: "1094318705967640602"
      }, {
        desc: "Confirmé",
        emoji: "<:XV3:1103353490761322496>",
        role: "1094318705967640601"
      }, {
        desc: "Expérimenté",
        emoji: "<:XV4:1103353417436516392>",
        role: "1094318705967640600"
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
        emoji: "🥳",
        role: "1094318705967640598"
      }, {
        desc: "Jeu de go",
        emoji: "♟️",
        role: "1109610157756928071"
      },
      {
        desc: "Partenariat",
        emoji: "🤝",
        role: "1109613359407571004"
      },
      {
        desc: "Gaming",
        emoji: "🎮",
        role: "1125071101349859514"
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
        emoji: "<:membre:1101954435791462500>",
        role: "1094318706248646870"
      }]
    }]
  }, {
    name: "relgement",
    type: 3,
    embed: [{
      color: '',
      roles: [{
        desc: "lu et approuvé",
        emoji: "<:valide:1109820816134242524>",
        role: "1094318706248646869"
      }]
    }]
  },{
    name: "rp",
    type: 3,
    embed: [{
      color: '',
      roles: [{
        desc: "Ne prenez ce rôle que si vous souhatez RP",
        emoji: "📝",
        role: "1113158106587865168"
      }]
    }]
  }, {
    name: "régression",
    type: 3,
    embed: [{
      color: '',
      roles: [{
        desc: "J'accepte le règlement",
        emoji: "<a:biberon:1132836548132470904>",
        role: "1132936677158039572"
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
  }, {
    name: "pet",
    type: 3,
    embed: [{
      color: '',
      roles: [{
        desc: "Je suis un bon chien",
        emoji: "<a:husky:1137858821730078740>",
        role: "1137856475130249376"
      }]
    }]
  }]
}