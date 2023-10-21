const Discord = require('discord.js');
const { EmbedBuilder, Embed } = Discord

const svgCaptcha = require('ppfun-captcha');
const svg2img = require('node-svg2img');

svgCaptcha.options.width = 500
svgCaptcha.options.height = 200

svgCaptcha.options.nodeDeviation                = 0.05 // 0.1
svgCaptcha.options.truncateLineProbability      = 0.5 // 0.5
svgCaptcha.options.truncateCurveProbability     = 0.5 // 0.5
svgCaptcha.options.truncateCurvePositionMin     = 0.4 // 0.4
svgCaptcha.options.truncateCurvePositionMax     = 0.6 // 0.6
svgCaptcha.options.connectionPathDeviation      = 10.0 // 10.0


module.exports = async (client, member) => {


    const captchaTimeToSolve = 180 * 1000 // en millisecondes



    let roleNonVerifie = member.guild.roles.cache.get(client.config.static.roles.nonVerifie)
    let roleCaptcha = member.guild.roles.cache.get(client.config.static.roles.captcha)
    let roleLuEtApprouve = member.guild.roles.cache.get(client.config.static.roles.luEtApprouve)

    let verifChannel = member.guild.channels.cache.get(client.config.static.channels.verification)

    member.roles.add(roleNonVerifie.id)




    let captcha;

    /*captcha = {
        text: "blabla",
        data: svgCaptcha.createCaptcha("blabla")
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



    let example = `<svg version="1.1" baseProfile="full" width="300" height="200"
    xmlns="http://www.w3.org/2000/svg">
       <rect width="100%" height="100%" fill="red" />
       <circle cx="150" cy="100" r="80" fill="green" />
       <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text></svg>`
    let captcha_data = captcha.data

    //console.log(captcha.data)

    captcha.data = captcha.data.replace(`xmlns="http://www.w3.org/2000/svg"`, `style="background-color: #1A1C00" xmlns="http://www.w3.org/2000/svg"`)



    svg2img(captcha.data, { format: 'png' }, async function(err, data) {


        let captchaBotMessage = await verifChannel.send({
            content: `<@${member.id}>`,
            embeds: [
            new EmbedBuilder()
                .setTitle(`Captcha > ${client.config.static.emojis.loading.tag}`)
                .setAuthor({ name: member.nickname ?? member.user.username, iconURL: member.user.displayAvatarURL() })
                .setColor("FDFFFF")
                .setDescription([
                    `Bonjour <@${member.id}>, pour continuer vous devez remplir ce captcha`,
                    `Lisez attentivement le code sur l'image ci-dessus constitué de **chiffres et lettres minuscules et majuscules.**`,
                    ``,
                    `Temps restant: <t:${Math.floor(Date.now()/1000)+Math.floor(captchaTimeToSolve/1000)}:R>`,
                ].join("\n"))
                .setTimestamp()
            ],
            files: [
                new Discord.AttachmentBuilder(data, "SPOILER_captcha.png")
            ]
        })


        let embeds_answers = {
            valid: (
                new EmbedBuilder()
                    .setTitle(`Captcha > ✅ Valide`)
                    .setAuthor({ name: member.nickname ?? member.user.username, iconURL: member.user.displayAvatarURL() })
                    .setColor("00FF00")
                    .setDescription([
                        `Captcha correct. Bienvenue sur le serveur`,
                    ].join("\n"))
                    .setTimestamp()),
            invalid: (
                new EmbedBuilder()
                    .setTitle(`Captcha > ❌ Invalide`)
                    .setAuthor({ name: member.nickname ?? member.user.username, iconURL: member.user.displayAvatarURL() })
                    .setColor("FF0000")
                    .setDescription([
                        `Réponse erronnée au captcha.`,
                    ].join("\n"))
                    .setTimestamp()),
            invalid_time: (
                new EmbedBuilder()
                    .setTitle(`Captcha > ❌ Invalide`)
                    .setAuthor({ name: member.nickname ?? member.user.username, iconURL: member.user.displayAvatarURL() })
                    .setColor("FF0000")
                    .setDescription([
                        `Vous avez mis trop de temps à répondre.`,
                    ].join("\n"))
                    .setTimestamp()),
                    
        }
        
        /*
        console.log("data:",data)
        await interaction.editReply({
            content: `✅ Captcha généré avec succès.\nAnswer: ||\`${captcha.text}\`||`,
            files: [
                new Discord.AttachmentBuilder(data, "SPOILER_captcha.png")
            ]
        })*/
        
        const filter = m => { return (m.author.id == member.id) }; // m.author.id == interaction.user.id
        const collector = await verifChannel.createMessageCollector({ filter, time: captchaTimeToSolve, max:1 });

        let answered = false

        collector.on('collect', m => {
            console.log("[DEBUG:guildMemberAdd.js] collect collector",m)
            answered = true
            m.delete().catch(e => {
                console.log(`[WARN:guildMemberAdd.js] Can't delete captcha response message: ${e}`)
            })

            if(m.content == captcha.text) {
                captchaBotMessage.edit({
                    embeds: [embeds_answers.valid]
                }).then(temp_m => { setTimeout(() => {temp_m.delete()},10*1000)})

                setTimeout(() => {
                    member.roles.remove(client.config.static.roles.nonVerifie).then(x => {
                        //console.log("Captcha valide: member.roles.remove(client.config.static.roles.nonVerifie)",x)
                    }).catch(e => {
                        //console.log("Captcha valide CATCH ERROR: member.roles.remove(client.config.static.roles.nonVerifie)",x)
                        console.log(e)
                    })
                    member.roles.add(client.config.static.roles.captcha).then(x => {}).catch(e => { console.log(e) })
                }, 500)
            } else {
                captchaBotMessage.edit({
                    embeds: [embeds_answers.invalid]
                }).then(temp_m => { setTimeout(() => {
                    temp_m.delete()
                },10*1000)})

                    member.user.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("FF0000")
                                .setDescription([
                                    `En rejoignant le serveur **${member.guild.name}**, vous avez remplis un captcha et celui-ci a été erronné.`,
                                    `En conséquences et par sécurité, vous avez été expulsé.e du serveur.`,
                                ].join("\n"))
                                .setTimestamp()
                        ]
                    }).then(() => {}).catch(e => {
                        console.log(`[INFO:guildMemberAdd.js] Cannot DM member`)
                    })
                setTimeout(() => {
                    member.kick(`Captcha invalide: Wrong answer`)
                }, 3000)
            }

        })


        collector.on("end", collected  => {
            console.log("[DEBUG:guildMemberAdd.js] ended collector",collected)

            setTimeout(() => {
                if(!answered) {
                    member.user.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("FF0000")
                                .setDescription([
                                    `En rejoignant le serveur **${member.guild.name}**, vous deviez remplir un captcha mais vous avez pris trop de temps.`,
                                    `En conséquences et par sécurité, vous avez été expulsé.e du serveur.`,
                                ].join("\n"))
                                .setTimestamp()
                        ]
                    }).then(() => {}).catch(e => {
                        console.log(`[INFO:guildMemberAdd.js] Cannot DM member`)
                    })
                    setTimeout(() => {
                        member.kick(`Captcha invalide: Time`)
                    }, 3000)

                    captchaBotMessage.edit({
                        embeds: [embeds_answers.invalid_time]
                    }).then(temp_m => { setTimeout(() => { temp_m.delete() },10*1000)})
                }
            }, 200)
        })


    })

}