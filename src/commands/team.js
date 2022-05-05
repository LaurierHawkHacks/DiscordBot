const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVerifiedUser } = require("../util/users");
const { createTeam, deleteTeam, getTeam, inviteUserToTeam, leaveTeam } = require("../util/teams");

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
    if(!verifiedUser)
        return await interaction.reply("This command can only be used by users who are verified!");

    const teamId  = verifiedUser.teamId;
    const team = teamId ? getTeam(teamId) : null;
    const captainId = team ? team.captain : null;

    const subCommand = interaction.options.getSubcommand();
    switch(subCommand) {
        case "create":{
            if(team)
                return await interaction.reply("You are already in a team!");

            createTeam(verifiedUser);
            break;
        }

        case "invite":{
            if(!team) 
                return await interaction.reply("You are not in a team!");

            if(!captainId)
                return await interaction.reply("You are not the captain of your team!");

            const targetId = interaction.options.getStringOption("target");
            if(targetId == userId)
                return await interaction.reply("You cannot invite yourself!");

            const verifiedTarget = getVerifiedUser(targetId);
            if(!verifiedTarget)
                return await interaction.reply("This user is not verified!");

            const targetTeamId = verifiedTarget.teamId;
            if(targetTeamId)
                return await interaction.reply("This user is already in a team!");

            inviteUserToTeam(team, verifiedUser, verifiedTarget);
            break;
        }

        case "delete":{
            if(!team) 
                return await interaction.reply("You are not in a team!");

            if(!captainId)
                return await interaction.reply("You are not the captain of your team!");

            //TODO: ask if sure.
            deleteTeam(team);
            break;
        }

        case "leave":{
            if(!team) 
                return await interaction.reply("You are not in a team!");

            //TODO: ask if sure.
            leaveTeam(team, verifiedUser);
            break;
        }

        default: { await interaction.reply("You're using this command incorrectly!"); }
    }
};

module.exports = { data: data, execute: execute, enabled: true, roleRequired: "" };