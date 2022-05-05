const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVerifiedUser } = require("../util/users");
const { getTeam } = require("../util/teams");

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
    const userId = interaction.author.id;
    const verifiedUser = getVerifiedUser(userId);
    if(!verifiedUser) {
        await interaction.reply("This command can only be used by users who are verified!");
        return;
    }

    const teamId  = verifiedUser.teamId;
    const team = teamId ? getTeam(teamId) : null;
    const captainId = team ? team.captain : null;

    const subCommand = interaction.options.getSubcommand();
    switch(subCommand) {
    case "create":
        if(team) {
            await interaction.reply("You are already in a team!");
            return;
        }

        //TODO: create new entry in DB
        //TODO: assign user as captain
        //TODO: mark user as being in a team
        break;

    case "invite":
        if(!team) {
            await interaction.reply("You are not in a team!");
            return;
        }

        if(!captainId) {
            await interaction.reply("You are not the captain of your team!");
            return;
        }
        
        //TODO: check if target is self.
        //TODO: check if target is verified.
        //TODO: check if target is already in team.
        //TODO: add request to user list.

        //TODO: send DM to invitee.
        //TODO: if accepted, check if they can still join AND add to team and send dm in team channel.
        //TODO: if rejected, send dm in team channel.
        break;

    case "delete":
        if(!team) {
            await interaction.reply("You are not in a team!");
            return;
        }

        if(!captainId) {
            await interaction.reply("You are not the captain of your team!");
            return;
        }

        //TODO: ask if sure.
        //TODO: mark team as abandoned.
        //TODO: Dm all team members.
        break;

    case "leave":
        if(!team) {
            await interaction.reply("You are not in a team!");
            return;
        }

        //TODO: ask if sure.
        //TODO: announce in team channel.
        break;

    default:
        await interaction.reply("You're using this command incorrectly!");
    }
};

module.exports = { data: data, execute: execute, enabled: true, roleRequired: "" };