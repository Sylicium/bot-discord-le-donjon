const Canvas = require('@napi-rs/canvas');
const { AttachmentBuilder } = require('discord.js');

module.exports = async (client, message) => {

  if (message.channel.type === 1) {
    const args = message.content.split(' ');

    if (args[0] != "damier") return;


    let picture = message.attachments.first();
    if (!picture) return message.reply('Pas d\'image lié au message...');

    await message.channel.sendTyping();

    const canvas = Canvas.createCanvas(picture.width, picture.height);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage(picture.url);
    context.drawImage(background, 0, 0, picture.width, picture.height);

    let carrés = []

    var nw, nh;

    if (picture.width < picture.height) {
      nw = 4;
      nh = 5;
    } else {
      nw = 5;
      nh = 4;
    }


    var n = nw * nh;
    var w = picture.width / nw;
    var h = picture.height / nh;

    var x = 0;
    var y = 0;
    var color;

    for (let i = 0; i < n; i++) {

      if (nw % 2 == 0) {
        if (y % 2 == 0) {
          if (x % 2 == 0) {
            color = 'noir';
          } else {
            color = 'blanc';
          }
        } else {
          if (x % 2 == 0) {
            color = 'blanc';
          } else {
            color = 'noir';
          }
        }
      } else {
        if (i % 2 == 0) {
          color = 'noir';
        } else {
          color = 'blanc';
        }
      }

      carrés.push({
        color: color,
        x: x * w,
        y: y * h
      });

      x++
      if (x >= nw) {
        x = 0;
        y++;
      }
    }

    const shuffleCarrés = carrés.sort((a, b) => 0.5 - Math.random());

    let files = []

    for (let i = 0; i < n; i++) {
      const carré = await Canvas.loadImage(`./pictures/${shuffleCarrés[i].color}.png`);
      context.drawImage(carré, shuffleCarrés[i].x, shuffleCarrés[i].y, w, h);

      const attachment = new AttachmentBuilder(await canvas.encode('png'), {
        name: `damier${n}.png`
      });

      files.push(attachment);
    }

    if (files.length < 10) {
      message.reply({
        files: files
      });
    } else {
      message.reply({
        files: files.slice(0, 9)
      });

      for (let i = 10; i < n; i += 10) {
        let x = 0 + i;
        let y = i + 9 > n ? n : 9 + i;

        message.reply({
          files: files.slice(x, y)
        });
      }
    }

    console.log(`Fin de la génération d\'un damier pour ${message.author}`)
  }
}