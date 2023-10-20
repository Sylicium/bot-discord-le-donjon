const Discord = require('discord.js');
const { MessageActivityType } = Discord;
const stats = require('../../functions/userStats');


let MessagesTemp = [

]
let maxMessageLog = 100
let messageSpamMaxTime = 8000 + 200// compte les messages envoyés les 6 dernières secondes
let messageAmountThreshold = 7
let muteDuration = 10*60*1000 // Default: 10*60*1000 (10min)


module.exports = async (client, message) => {



  function checkForSpam() {


    MessagesTemp.push({
      channelID: message.channel.id,
      authorID: message.author.id,
      timestamp: Date.now(),
      content: message.content
    })
  
    if(MessagesTemp.length > maxMessageLog) MessagesTemp.shift()
    
  

    let isChannelAllowSpam = false;
    try {
      if(message.channel.topic) {
    
        let isChannelAllowSpam_regex = message.channel.topic.match(/\$\$[^$]*\$\$/gmi) ?? false
        if(isChannelAllowSpam_regex) {
          let chanJSON = JSON.parse(isChannelAllowSpam_regex[0].substr(2, isChannelAllowSpam_regex[0].length-4))
          isChannelAllowSpam = chanJSON.allowSpam == true ?? false
        }
      
      }
    } catch(e) {
      console.log(e)
    }
  
    
    if(isChannelAllowSpam) return console.log(`[AntiSpam] Channel '${message.channel.id}' is on allowSpam:true`)
  
    let dateNow = Date.now()
    let amount = MessagesTemp.filter(x => {
      return ( x.timestamp > (dateNow - messageSpamMaxTime) )
      && ( x.channelID == message.channel.id )
      && ( x.authorID == message.author.id )
    }).length
    console.log(`[messageCreate:AntiSpam] ${amount} messages`)
    
    if(message.author.id == "770334301609787392") return;

    if(amount > messageAmountThreshold) {
      message.member.timeout(muteDuration).then(() => {
        message.channel.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor("FF0000")
              .setDescription(`**${message.member.nickname ?? message.author.username}** a été mute pour spam.\nFin du mute <t:${Math.floor((Date.now()+muteDuration)/1000)}:R>`)
          ]
        })

        try {
          message.author.send({
            content: `Vous avez été mute sur **${message.guild.name}** pour spam.\nFin du mute <t:${Math.floor((Date.now()+muteDuration)/1000)}:R>`
          })
        } catch(e) {
          console.log(e)
        }
        
      }).catch((e) => {
        console.log(e)
        message.channel.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor("FF0000")
              .setDescription(`⚠ Aïe ! Arrête de spammer **${message.member.nickname ?? message.author.username}** ! Je peux pas te mute !\`\`\`js\n${e}\`\`\``)
          ]
        })
      })

      
      console.log("BEFORE:", MessagesTemp)
      console.log("AFTER:",MessagesTemp.filter(x => {
        return ! (
          ( x.timestamp > (dateNow - messageSpamMaxTime) )
          && ( x.channelID == message.channel.id )
          && ( x.authorID == message.author.id )
        )
      }))
      MessagesTemp = MessagesTemp.filter(x => {
        return ! (
          ( x.timestamp > (dateNow - messageSpamMaxTime) )
          && ( x.channelID == message.channel.id )
          && ( x.authorID == message.author.id )
        )
      })

    }

    
  }

  checkForSpam()


  if (message.attachments.size > 0)
    stats.addImg(client, message);
  if (message.content)
    stats.addMess(client, message);
}