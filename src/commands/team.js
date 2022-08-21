const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVerifiedUser } = require("../util/users");
const { addUserToTeam, createTeam, getTeam } = require("../util/teams");
const { logger } = require("../index");
const { config } = require("../config");

const data = new SlashCommandBuilder()
    .setName("team")
    .setDescription("Command for team management.")
    .addSubcommand(subCommand => 
        subCommand.setName("create")
            .setDescription("Create a team.")
    )

    .addSubcommand(subCommand => 
        subCommand.setName("invite")
            .setDescription("Add a user to your team.")
            .addUserOption(option =>
                option.setName("target")
                    .setDescription("The user to invite.")
                    .setRequired(true)
            )
    );
    
// .addSubcommand(subCommand => 
//     subCommand.setName("delete")
//         .setDescription("Delete your team only if you created the team.")
// )

// .addSubcommand(subCommand => 
//     subCommand.setName("leave")
//         .setDescription("Leave your team.")
// )

// .addSubcommand(subCommand => 
//     subCommand.setName("dconfirm")
//         .setDescription("Delete your team only if you created the team.")
// )

// .addSubcommand(subCommand => 
//     subCommand.setName("lconfirm")
//         .setDescription("Leave your team.")
// );

const execute = async (interaction) => {
    const userId = interaction.member.id;
    const verifiedUser = await getVerifiedUser(userId);
    if(!verifiedUser)
        return await interaction.reply("❌ This command can only be used by users who are verified!");

    const teamId  = verifiedUser.teamId;
    const team = teamId ? await getTeam(teamId) : null;
    const captainId = team ? team.captain : null;

    const subCommand = interaction.options.getSubcommand();
    switch(subCommand) {
        case "create": {
            if(interaction.channelId !== config.discord.teamCreationChannelId)
                return await interaction.reply("❌ This command can only be used in the create-a-team channel!");
    
            if(team)
                return await interaction.reply("❌ You are already in a team!");

            const teamName = await createTeam(userId, interaction.guild);
            await interaction.reply("✅ Your team has been created! Go to your team channel to start inviting people!");
            logger.info("Created team: " + teamName + " by user: " + interaction.member.user.username);
            break;
        }

        case "invite": {
            if(!config.discord.teamTextCategoryIds.includes(interaction.channel.parentId))
                return await interaction.reply("❌ This command can only be used in your team channel!");

            if(interaction.channelId === config.discord.teamCreationChannelId || interaction.channelId === config.discord.lftChannelId)
                return await interaction.reply("❌ This command can only be used in your team channel!");

            if(!team) 
                return await interaction.reply("❌ You are not in a team!");

            if(captainId != userId)
                return await interaction.reply("❌ You are not the captain of your team!");

            const targetId = interaction.options.getUser("target").id;
            if(targetId == userId)
                return await interaction.reply("❌ You cannot invite yourself!");

            const verifiedTarget = await getVerifiedUser(targetId);
            if(!verifiedTarget)
                return await interaction.reply("❌ This user is not verified!");

            const targetTeamId = verifiedTarget.teamId;
            if(targetTeamId)
                return await interaction.reply("❌ This user is already in a team!");

            await interaction.reply("✅ Teammates invited!");
            await addUserToTeam(teamId, captainId, targetId, interaction.client);
            logger.info("User: " + interaction.member.user.username + " invited user: " + verifiedTarget.email + " to team: " + team.name);
            break;
        }

        case "delete": {
            await interaction.reply("❌ This command is not yet implemented!");
            // if(!team) 
            //     return await interaction.reply("❌ You are not in a team!");

            // if(!captainId)
            //     return await interaction.reply("❌ You are not the captain of your team!");

            // await interaction.reply("⚠️ If you're sure, please type `/tean dconfirm`");
            break;
        }

        case "dconfirm": {
            await interaction.reply("❌ This command is not yet implemented!");

            // if(!team) 
            //     return await interaction.reply("❌ You are not in a team!");

            // if(!captainId)
            //     return await interaction.reply("❌ You are not the captain of your team!");

            // deleteTeam(team);
            break;
        }

        case "leave": {
            await interaction.reply("❌ This command is not yet implemented!");

            // if(!team) 
            //     return await interaction.reply("❌ You are not in a team!");

            // if(team.captainId == userId)
            //     return await interaction.reply("❌ You can't leave a team you're the captain of! You have to delete your team first!");

            // await interaction.reply("⚠️ If you're sure, please type `/tean lconfirm`");
            break;
        }

        case "lconfirm": {
            await interaction.reply("❌ This command is not yet implemented!");

            // if(!team) 
            //     return await interaction.reply("❌ You are not in a team!");

            // if(team.captainId == userId)
            //     return await interaction.reply("❌ You can't leave a team you're the captain of! You have to delete your team first!");

            // leaveTeam(team, verifiedUser);
            break;
        }

        default: { await interaction.reply("❌ You're using this command incorrectly!"); }
    }
};

module.exports = { data: data, execute: execute, enabled: true, roleRequired: "" };