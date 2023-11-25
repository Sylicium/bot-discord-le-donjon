const Discord = require('discord.js');
const {
  ApplicationCommandType
} = Discord;
const canvasCmd = require('../../functions/canvasCmd');
const fs = require("fs")
const somef = require("../../someFunctions")

module.exports = {
    name: "help",
    description: "Affiche la liste des commandes",
    type: ApplicationCommandType.ChatInput,
    options: [{
      name: 'command',
      description: 'Commande',
      type: Discord.ApplicationCommandOptionType.String
    }],
    run: async (client, interaction) => {

        let commandeName = interaction.options.getString("command")?.toLowerCase().trim() || null
        let commandes = client.commands.map(x => (x?.name?.toLowerCase().trim() ?? `${Date.now()}Error`))

        function getCommandStringFormat(cmd) {
            console.log("cmd.options:",cmd)
            return `${cmd.name.trim()}${(cmd.options != null && cmd.options.length > 0) ? ` ${
                cmd.options.map(y => {
                    return `${y.required ? '<':'['}${y.name?.trim()}${y.required ? '>':']'}`
                }).join(" ")}`: ""}`
        }
        
        function getEmojiPerm(command) {
            //console.log("command:",command) //command.hasOwnProperty(command.default_member_permissions), command.default_member_permissions?.length ?? "<0>")
            //console.log("property ->",command.hasOwnProperty("default_member_permissions")) //, command.default_member_permissions?.length ?? "<0>")
            //console.log("1:",command.default_member_permissions)
            //console.log("2:",(command.default_member_permissions?.map(x => { return interaction.member.permissions.has(x) })))
            return (
                command.hasOwnProperty("default_member_permissions") && command.default_member_permissions.length > 0
                ? (
                    !(command.default_member_permissions.map(x => { return interaction.member.permissions.has(x) })).includes(false)
                    ? `🔑`
                    : "🔒" // "🔐"
                ) : ""
            )
        }

        if(commandeName != null) {
            let la_commande = client.commands.find(x => { return x.name?.toLowerCase().trim() == commandeName })
            if(!la_commande) {
                let guess = commandes.map(x => {
                    return {
                        cmd: x,
                        score: somef.compareString(x, commandeName)
                    }
                }).sort((a,b) => b.score-a.score)
                console.log("guess:",)
                return interaction.reply({
                    content: `Commande inconnue: \`${commandeName}\`. Vouliez vous écrire \`${guess[0].cmd}\` ?`,
                    ephemeral: true
                })
            }
            console.log("la_commande:",la_commande)
            
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(`${getEmojiPerm(la_commande)} /${la_commande.name}`)
                        .setColor("00FF00")
                        .setDescription([
                            `**Description:** _${la_commande.description}_`,
                            `**Permissions:** ${la_commande.default_member_permissions.map(x => x.toUpperCase()).join(", ")}`,
                            `**Format:** \`\`\`/${getCommandStringFormat(la_commande)}\`\`\``,
                        ].join("\n"))
                ],
                ephemeral: true
            })


        } else {
            
            function haveperms(cmd) { return cmd.hasOwnProperty("default_member_permissions") && cmd.default_member_permissions.length > 0 }
    
            let command_list = client.commands.map(x => {
                return `${getEmojiPerm(x)} \`${getCommandStringFormat(x)}\`: _${x.description.trim()}_`
            }).sort((a,b) => {
                if(haveperms(a) && !haveperms(b)) {
                    return 1
                } else if(!haveperms(a) && haveperms(b)) {
                    return -1
                }
                return a.localeCompare(b)
            })
    
    
            interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle(`Liste des commandes du bot`)
                            .setDescription([
                                `${command_list.join("\n")}`,
                                ``,
                                `🔑 Requiert des permissions que vous avez`,
                                `🔒 Requiert des permissions d'administration`,
                            ].join("\n"))
                            .setFooter({ text: `Faites /help [commande] pour avoir plus d'infos sur une commande.` })
                    ]
            })
        
        }

    }
}