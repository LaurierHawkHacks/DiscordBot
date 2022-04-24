const { MessageEmbed } = require("discord.js");

module.exports = {  
    NoPermissionEmbed: new MessageEmbed()
        .setColor("RED")
        .setTitle("🔴 Command Failed!")
        .setDescription("You have insufficient permissions to use this command.")
};