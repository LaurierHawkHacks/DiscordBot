const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVerifiedUser } = require("../util/users");

const data = new SlashCommandBuilder()
    .setName("minecraft")
    .setDescription("Links your Discord account to the (Java) Minecraft server and whitelists you.")
    .addStringOption(option =>
        option.setName("minecraftUsername")
            .setDescription("Your Minecraft username to login to the server with..")
            .setRequired(true)
    );

const execute = async (interaction) => {
    const userId = interaction.author.id;
    const verifiedUser = await getVerifiedUser(userId);
    if(!verifiedUser)
        return await interaction.reply("This command can only be used by users who are verified!");

    //get user from firestore table.
    //check if user already has a minecraft user in the table.
    //if not, add user to table AND send their username to the whitelist.
    //if so, delete old username from the whitelist, send their new username to the whitelist, and add username to table.
};

module.exports = { data: data, execute: execute, enabled: true, roleRequired: "" };