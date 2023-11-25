const Discord = require('discord.js');
const {
  ApplicationCommandType
} = Discord;
const canvasCmd = require('../../functions/canvasCmd');
const fs = require("fs")

module.exports = {
    name: "help",
    description: "Affiche la liste des commandes",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {


        function getEmojiPerm(command) {
            console.log("command:",command) //command.hasOwnProperty(command.default_member_permissions), command.default_member_permissions?.length ?? "<0>")
            console.log("property ->",command.hasOwnProperty(command.default_member_permissions)) //, command.default_member_permissions?.length ?? "<0>")
            console.log("1:",command.default_member_permissions)
            console.log("2:",(command.default_member_permissions.map(x => { return interaction.user.permissions.has(x) })))
            return (
                command.hasOwnProperty(command.default_member_permissions) && command.default_member_permissions.length > 0
                ? (
                    !(command.default_member_permissions.map(x => { return interaction.user.permissions.has(x) })).includes(false)
                    ? `🔑`
                    : "🔒" // "🔐"
                ) : ""
            )
        }


        let command_list = client.commands.map(x => {
            return `${getEmojiPerm(x)} \`${x.name.trim()}${x.options ? ` ${
                x.options.map(y => {
                return `${y.required ? '<':'['}${y.name.trim()}${y.required ? '>':']'}`
                }).join(" ")}`: ""}\`: _${x.description.trim()}_`
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
                ]
        })

    }
}