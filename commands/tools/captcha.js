const Discord= require('discord.js');
const { ApplicationCommandType, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = Discord


const svgCaptcha = require('ppfun-captcha');
const svg2img = require('node-svg2img');

svgCaptcha.options.width = 500
svgCaptcha.options.height = 200

svgCaptcha.options.nodeDeviation                = 0.1// 0.1
svgCaptcha.options.truncateLineProbability      = 0.5 // 0.5
svgCaptcha.options.truncateCurveProbability     = 0.5 // 0.5
svgCaptcha.options.truncateCurvePositionMin     = 0.4 // 0.4
svgCaptcha.options.truncateCurvePositionMax     = 0.6 // 0.6
svgCaptcha.options.connectionPathDeviation      = 10 // 10.0


module.exports = {
    name: "captcha",
    type: ApplicationCommandType.ChatInput,
    description: "Test captcha",
    run: async (client, interaction) => {

      await interaction.deferReply()

      let captcha;
  
      /*captcha = {
          text: "Dibistan",
          data: svgCaptcha.createCaptcha("Dibistan")
      }*/
  
  
      function gChar(type) {
          if (type == 1) {
              return client.somef.choice("012345".split(""))
          } else if (type == 2) {
              return client.somef.choice("abcdef".split(""))
          } else {
              return client.somef.genHex(1)
          }
      }
      let stroke_color = `#${gChar(1)}${gChar(3)}${gChar(1)}${gChar(3)}${gChar(1)}${gChar(3)}`
      let fill_color = `#${gChar(2)}${gChar(3)}${gChar(2)}${gChar(3)}${gChar(2)}${gChar(3)}`
  
      captcha = svgCaptcha.create({
          ignoreChars: "0o1ilI",
          stroke: stroke_color,
          fill: fill_color,
          size: 6
      })
  
  
      /*
      captcha = svgCaptcha.createMathExpr({
          mathMin: 34,
          mathMax: 132,
          mathOperator: "+",
      })
      */
  
      interaction.editReply(`${client.config.static.emojis.loading.tag} Génération du captcha...`).then(async loading_msg => {
          /*
              let png = await svgToImg.from(captcha.data).toPng({ encoding: "base64" }).catch(err => {
              console.log(err)
              loading_msg.edit(`❌[1] Une erreur est survenue à la génération du captcha: \`\`\`js\n${err}\`\`\` `)
          })
          */
  
  
          let example = `<svg version="1.1" baseProfile="full" width="300" height="200"
          xmlns="http://www.w3.org/2000/svg">
             <rect width="100%" height="100%" fill="red" />
             <circle cx="150" cy="100" r="80" fill="green" />
             <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text></svg>`
          let d = captcha.data
  
          //console.log(captcha.data)
  
          captcha.data = captcha.data.replace(`xmlns="http://www.w3.org/2000/svg"`, `style="background-color: #1A1C00" xmlns="http://www.w3.org/2000/svg"`)
  
          //console.log(`data:image/svg+xml;base64,${Buffer.from(captcha.data).toString("base64")}`)
  
          svg2img(captcha.data, { format: 'png' }, async function(err, data) {
  
              let svg_test = `PHN2ZyB2ZXJzaW9uPSIxLjEiIGJhc2VQcm9maWxlPSJmdWxsIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIKeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0icmVkIiAvPgogICA8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSJncmVlbiIgLz4KICAgPHRleHQgeD0iMTUwIiB5PSIxMjUiIGZvbnQtc2l6ZT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj5TVkc8L3RleHQ+PC9zdmc+`
  
              /*message.inlineReply("✅ Captcha généré avec succès.",
                  (new MessageEmbed()
                      .setTitle("Captcha")
                      .setFooter(`Answer: ${captcha.text}`)
                  )
              )*/
              console.log("data:",data)
              await interaction.editReply({
                  content: `✅ Captcha généré avec succès.\nAnswer: ||\`${captcha.text}\`||`,
                  files: [
                      new Discord.AttachmentBuilder(data, "SPOILER_captcha.png")
                  ]
              })
              
              const filter = m => { return (m.author.id == interaction.user.id) }; // m.author.id == interaction.user.id
              const collector = await interaction.channel.createMessageCollector({ filter, time: 30*1000, max:1 });
  
              let answered = false
  
              collector.on('collect', m => {
                  console.log("collect collector",m)
                  answered = true
                  m.delete().catch(e => {
                    console.log(`Can't delete captcha response message: ${e}`)
                  })
  
                  if(m.content == captcha.text) {
                      interaction.editReply(`<@${m.author.id}> ✅ Captcha correct.`).then(temp_m => { setTimeout(() => {temp_m.delete()},10*1000)})
                  } else {
                      interaction.editReply(`<@${m.author.id}> ❌ Réponse erronée au captcha.`).then(temp_m => { setTimeout(() => {temp_m.delete()},10*1000)})
                  }
  
              })
  
  
              collector.on("end", collected  => {
                console.log("ended collector",collected)
                  setTimeout(() => {
                      if(!answered) {
                          interaction.editReply(`<@${interaction.user.id}> ❌ Vous avez mis trop de temps à faire le captcha.`).then(temp_m => { setTimeout(() => {temp_m.delete()},10*1000)})
                      }
                  }, 200)
              })
  
  
          })
      })

      
    }
  }