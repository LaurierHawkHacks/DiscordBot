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
    )

    .addSubcommand(subCommand => 
        subCommand.setName("invite")
            .setDescription("Add a user to your team.")
            .addUserOption(option =>
                option.setName("target")
                    .setDescription("The user to invite.")
                    .setRequired(true)
            )
    )
    
    .addSubcommand(subCommand => 
        subCommand.setName("delete")
            .setDescription("Delete your team only if you created the team.")
    )

    .addSubcommand(subCommand => 
        subCommand.setName("leave")
            .setDescription("Leave your team.")
    )

    .addSubcommand(subCommand => 
        subCommand.setName("dconfirm")
            .setDescription("Delete your team only if you created the team.")
    )

    .addSubcommand(subCommand => 
        subCommand.setName("lconfirm")
            .setDescription("Leave your team.")
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
        case "create": {
            if(team)
                return await interaction.reply("❌ You are already in a team!");

            const name = interaction.options.getStringOption("name");
            createTeam(verifiedUser, name);
            break;
        }

        case "invite": {
            if(!team) 
                return await interaction.reply("❌ You are not in a team!");

            if(!captainId)
                return await interaction.reply("❌ You are not the captain of your team!");

            const targetId = interaction.options.getUserOption("target").id;
            if(targetId == userId)
                return await interaction.reply("❌ You cannot invite yourself!");

            const verifiedTarget = getVerifiedUser(targetId);
            if(!verifiedTarget)
                return await interaction.reply("❌ This user is not verified!");

            const targetTeamId = verifiedTarget.teamId;
            if(targetTeamId)
                return await interaction.reply("❌ This user is already in a team!");

            inviteUserToTeam(team, verifiedUser, verifiedTarget);
            break;
        }

        case "delete": {
            if(!team) 
                return await interaction.reply("❌ You are not in a team!");

            if(!captainId)
                return await interaction.reply("❌ You are not the captain of your team!");

            await interaction.reply("⚠️ If you're sure, please type `/tean DELETECONFIRM`");
            break;
        }

        case "confirm": {
            if(!team) 
                return await interaction.reply("❌ You are not in a team!");

            if(!captainId)
                return await interaction.reply("❌ You are not the captain of your team!");

            deleteTeam(team);
            break;
        }

        case "leave": {
            if(!team) 
                return await interaction.reply("❌ You are not in a team!");

            if(team.captainId == userId)
                return await interaction.reply("❌ You can't leave a team you're the captain of! You have to delete your team first!");

            await interaction.reply("⚠️ If you're sure, please type `/tean LEAVECONFIRM`");
            break;
        }

        case "lconfirm": {
            if(!team) 
                return await interaction.reply("❌ You are not in a team!");

            if(team.captainId == userId)
                return await interaction.reply("❌ You can't leave a team you're the captain of! You have to delete your team first!");

            leaveTeam(team, verifiedUser);
            break;
        }

        default: { await interaction.reply("❌ You're using this command incorrectly!"); }
    }
};

module.exports = { data: data, execute: execute, enabled: true, roleRequired: "" };