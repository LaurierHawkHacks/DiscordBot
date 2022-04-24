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
        //TODO: check if target is self.
        //TODO: check if target is verified.
        //TODO: check if target is already in team.
        //TODO: add request to user list.

        //TODO: send DM to invitee.
        //TODO: if accepted, check if they can still join AND add to team and send dm in team channel.
        //TODO: if rejected, send dm in team channel.
        break;

    case "delete":
        //TODO: check if captain.
        //TODO: ask if sure.
        //TODO: mark team as abandoned.
        //TODO: Dm all team members.
        break;

    case "leave":
        //TODO: check if in team.
        //TODO: ask if sure.
        //TODO: announce in team channel.
        break;
    }

    await interaction.reply("hey!!");
};

module.exports = { data: data, execute: execute, enabled: true, roleRequired: "" };