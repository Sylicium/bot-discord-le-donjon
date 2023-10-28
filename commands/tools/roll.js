const {
  ApplicationCommandType,
  AttachmentBuilder
} = require('discord.js');
const { cp } = require('fs');

module.exports = {
  name: 'roll',
  type: ApplicationCommandType.ChatInput,
  description: "Lance un dé.",
  // default_member_permissions: ['Administrator'],
  options: [{
    name: 'rpg',
    description: 'Kit de dés RPG',
    type: 1,
    options: [{
      name: 'type',
      description: 'Choisis le dé à lancer.',
      type: 3,
      required: true,
      choices: [{
        name: 'dé 4',
        value: '4'
      }, {
        name: 'dé 6',
        value: '6'
      }, {
        name: 'dé 8',
        value: '8'
      }, {
        name: 'dé 10',
        value: '10'
      }, {
        name: 'dé 12',
        value: '12'
      }, {
        name: 'dé 20',
        value: '20'
      }, {
        name: 'dé 100',
        value: '100'
      }]
    }]
  }, {
    name: 'personnalisé',
    description: 'Dés avec une valeur max choisis par le lanceur.',
    type: 1,
    options: [{
      name: 'valeur',
      description: 'Choisis la valeur max pour ton lancé.',
      type: 10
    }]
  }],
  run: async (client, interaction) => {
    // const Subcommand = interaction.options.getSubcommand() || null;
    // if (!Subcommand) return interaction.reply({ content: 'Quelque chose s\'est mal passé..', ephemeral: true });

    // if (Subcommand === "personnalisé") {
    //   const maxNumber = interaction.options.getNumber('valeur') || null;
    //   if (!maxNumber) return interaction.reply({ content: 'Quelque chose s\'est mal passé..', ephemeral: true });

    //   const roll = Math.floor(Math.random() * maxNumber) + 1;

    //   const { AsciiTable3 } = require('ascii-table3');
    //   var table = new AsciiTable3()
    //     .setHeading('Dé', 'resultat')
    //     .setAlignCenter(2)
    //     .setStyle('unicode-double')

    //   table.addRow(maxNumber, roll)

    //   interaction.reply({ content: '```\n' + table.toString() + '\n```' })
    // } else {
    //   const dice = interaction.options.getString('type') || null;
    //   if (!dice) return interaction.reply({ content: 'Quelque chose s\'est mal passé..', ephemeral: true });

    //   const Canvas = require('@napi-rs/canvas');
    //   const canvas = Canvas.createCanvas(128, 128);
    //   const ctx = canvas.getContext('2d');

    //   const roll = await Canvas.loadImage(`./pictures/roll/de-${dice}-faces.png`);
    //   ctx.drawImage(roll, 0, 0, 128, 128);

    //   const value = (Math.floor(Math.random() * Number(dice)) + 1).toString();

    //   const pose = {
    //     4: {
    //       font: 24,
    //       x: 63,
    //       y: 75
    //     },
    //     6: {
    //       font: 24,
    //       x: 56,
    //       y: 78
    //     },
    //     8: {
    //       font: 24,
    //       x: 60,
    //       y: 68
    //     },
    //     10: {
    //       font: 24,
    //       x: 66,
    //       y: 64
    //     },
    //     12: {
    //       font: 24,
    //       x: 62,
    //       y: 69
    //     },
    //     20: {
    //       font: 18,
    //       x: 63,
    //       y: 72
    //     },
    //     100: {
    //       font: 24,
    //       x: 56,
    //       y: 78
    //     },
    //   }

    //   ctx.font = `${pose[dice].font}px arial`;
    //   ctx.fillStyle = '#fff';
    //   ctx.textAlign = "center";
    //   ctx.fillText(value, pose[dice].x, pose[dice].y);

    //   const attachment = new AttachmentBuilder(await canvas.encode('png'), {
    //     name: 'roll.png'
    //   });

    //   interaction.reply({
    //     content: `${interaction.user} à lancé un dé **${dice}**`,
    //     files: [attachment]
    //   });
    // }
    const Subcommand = interaction.options.getSubcommand() || null;
    if (!Subcommand) return interaction.reply({ content: 'Quelque chose s\'est mal passé..', ephemeral: true });

    var roll, value;

    if (Subcommand === "personnalisé") {
      roll = interaction.options.getNumber('valeur') || null;
      if (!roll) return interaction.reply({ content: 'Quelque chose s\'est mal passé..', ephemeral: true });

      value = (Math.floor(Math.random() * roll) + 1).toString();
    } else {
      roll = interaction.options.getString('type') || null;
      if (!roll) return interaction.reply({ content: 'Quelque chose s\'est mal passé..', ephemeral: true });
      value = (Math.floor(Math.random() * Number(roll)) + 1).toString();
    }

    const Canvas = require('@napi-rs/canvas');
    const canvas = Canvas.createCanvas(128, 128);
    const ctx = canvas.getContext('2d');

    const picture = await Canvas.loadImage(`./pictures/roll/de-${Subcommand === 'rpg' ? roll : 6}-faces.png`);
    ctx.drawImage(picture, 0, 0, 128, 128);

    const pose = {
      4: {
        font: 24,
        x: 63,
        y: 75
      },
      6: {
        font: 24,
        x: 56,
        y: 78
      },
      8: {
        font: 24,
        x: 60,
        y: 68
      },
      10: {
        font: 24,
        x: 66,
        y: 64
      },
      12: {
        font: 24,
        x: 62,
        y: 69
      },
      20: {
        font: 18,
        x: 63,
        y: 72
      },
      100: {
        font: 24,
        x: 56,
        y: 78
      },
    }

    ctx.font = `${pose[Subcommand === 'rpg' ? roll : 6].font}px Arial`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = "center";
    ctx.fillText(value, pose[Subcommand === 'rpg' ? roll : 6].x, pose[Subcommand === 'rpg' ? roll : 6].y);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), {
      name: 'roll.png'
    });

    interaction.reply({
      content: `${interaction.user} à lancé un dé **${roll}**`,
      files: [attachment]
    });
  }
};

// async function reply(interaction, roll, value) {

//   const Subcommand = interaction.options.getSubcommand() || null;
//   if (!Subcommand) return interaction.reply({ content: 'Quelque chose s\'est mal passé..', ephemeral: true });

//   var roll, value;

//   if (Subcommand === "personnalisé") {
//     roll = interaction.options.getNumber('valeur') || null;
//     if (!roll) return interaction.reply({ content: 'Quelque chose s\'est mal passé..', ephemeral: true });

//     value = Math.floor(Math.random() * roll) + 1;
//   } else {
//     roll = interaction.options.getString('type')
//     if (!roll) return interaction.reply({ content: 'Quelque chose s\'est mal passé..', ephemeral: true });
//     value = (Math.floor(Math.random() * Number(roll)) + 1).toString();
//   }

//   const Canvas = require('@napi-rs/canvas');
//   const canvas = Canvas.createCanvas(128, 128);
//   const ctx = canvas.getContext('2d');

//   const picture = await Canvas.loadImage(`./pictures/roll/de-${Subcommand === 'rpg' ? roll : 6}-faces.png`);
//   ctx.drawImage(picture, 0, 0, 128, 128);

//   const pose = {
//     4: {
//       font: 24,
//       x: 63,
//       y: 75
//     },
//     6: {
//       font: 24,
//       x: 56,
//       y: 78
//     },
//     8: {
//       font: 24,
//       x: 60,
//       y: 68
//     },
//     10: {
//       font: 24,
//       x: 66,
//       y: 64
//     },
//     12: {
//       font: 24,
//       x: 62,
//       y: 69
//     },
//     20: {
//       font: 18,
//       x: 63,
//       y: 72
//     },
//     100: {
//       font: 24,
//       x: 56,
//       y: 78
//     },
//   }

//   ctx.font = `${pose[Subcommand === 'rpg' ? roll : 6].font}px arial`;
//   ctx.fillStyle = '#fff';
//   ctx.textAlign = "center";
//   ctx.fillText(value, pose[Subcommand === 'rpg' ? roll : 6].x, pose[Subcommand === 'rpg' ? roll : 6].y);

//   const attachment = new AttachmentBuilder(await canvas.encode('png'), {
//     name: 'roll.png'
//   });

//   interaction.reply({
//     content: `${interaction.user} à lancé un dé **${roll}**`,
//     files: [attachment]
//   });

// }