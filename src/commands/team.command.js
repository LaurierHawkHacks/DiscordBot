const { SlashCommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandBuilder()
    .setName("team")
    .setDescription("Command for team management.")
    .addSubcommand(subCommand => 
        subCommand.setName("create")
            .setDescription("Create a team.")
            .addStringOption(option =>
                option.setName("name")
                    .setDescription("The name of the team.")
                    .setRequired(true)
            )
    );

const execute = async (interaction) => {
    //TODO: check if verified

    const subCommand = interaction.options.getSubcommand();
    switch(subCommand) {
    case "create":
        //TODO: check if already in team
        //TODO: create new entry in DB
        //TODO: assign user as captain
        //TODO: mark user as being in a team
        break;

    case "invite":
        //TODO: check if in team.
        //TODO: check if captain.
        //TODO: check if target is verified.
        //TODO: check if target is already in team.
        //TODO: add request to user list.
        break;

    case "delete":
        break;

    case "join":
        break;

    case "kick":
        break;

    }

    await interaction.reply("hey!!");
};

module.exports = { data, execute, enabled: true };