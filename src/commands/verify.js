const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVerifiedUser, isAccepted } = require("../util/users");
const { addVerifiedUser } = require("../util/users");
const { logger } = require("../index");
const { config } = require("../config");

const data = new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Command used to verify that you're a registered user.")
    .addStringOption(option =>
        option.setName("email")
            .setDescription("The email address you used on your application.")
            .setRequired(true)
    );

const execute = async (interaction) => {
    try {
        const user = interaction.user;
        const verifiedUser = await getVerifiedUser(user.id);
        if(interaction.channelId !== config.discord.verificationChannelId)
            return await interaction.reply({content: "❌ This command can only be used in the verification channel!", ephemeral: true});
    
        if(verifiedUser)
            return await interaction.reply({content: "❌ The email specified isn't in our list of accepted users!", ephemeral: true});

        const email = interaction.options.getString("email").trim();
        const accepted = await isAccepted(user.id, email);
        if(!accepted)
            return await interaction.reply({content: "❌ This command can only be used by users who have been officially accepted!", ephemeral: true});

        await interaction.reply({content: "✅ You are now verified! This channel will disappear in 5 seconds!", ephemeral: true});
        await addVerifiedUser(user.id, interaction.member);
        logger.info("Verified user: " + user.username + " with email: " + email);

    } catch(err) { logger.error("ERR while trying to verify!"); }
};

module.exports = { data: data, execute: execute, enabled: true, roleRequired: "" };