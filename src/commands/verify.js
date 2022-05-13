const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVerifiedUser, getSheetsUser } = require("../util/users");
const { addVerifiedUser } = require("../util/users");

const data = new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Command used to verify that you're a registered user.")
    .addStringOption(option =>
        option.setName("email")
            .setDescription("The email address you used on your application.")
            .setRequired(true)
    );

const execute = async (interaction) => {
    const userId = interaction.author.id;
    const verifiedUser = await getVerifiedUser(userId);
    if(verifiedUser)
        return await interaction.reply("❌ This command can only be used by users who are NOT verified!");

    const email = interaction.options.getStringOption("email");
    const sheetsUser = await getSheetsUser(email);
    if(!sheetsUser.isAccepted)
        return await interaction.reply("❌ This command can only be used by users who have been officially accepted!");

    await addVerifiedUser(userId, interaction.author);
    await interaction.reply("✔️ You are now verified!");
};

module.exports = { data: data, execute: execute, enabled: true, roleRequired: "" };