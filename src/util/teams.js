const team = require("../commands/team");
const { db } = require("./firestore");
const { logger } = require("../index");
const { config } = require("../config");

const createTeam = async (userId, server) => {
    // Get the team category and calculate the new team's name.
    const x = await getTextCategoryForNewTeam(server);
    const textCategory = x.category;
    const totalChannels = x.totalChannels; 
    const voiceCategory = await getVoiceCategoryForNewTeam(server);
    const teamNumber = 1 + Math.round( (totalChannels - 2) / 2);
    logger.debug("Total channel Count is ", totalChannels);

    // Create team channel.
    const voiceChannel = await voiceCategory.createChannel(`Team #${teamNumber}`, {type: "GUILD_VOICE"});
    const textChannel = await textCategory.createChannel(`team-#${teamNumber}`, {type: "GUILD_TEXT"});

    // Adds new team to teams col.
    const teamDocRef = await db.collection("teams").add({
        captain: userId,
        members: [userId],
        name: teamNumber,
        active: true,

        text: textChannel.id,
        voice: voiceChannel.id
    });

    // Mark the user as being in a team.
    const userDocRef = db.collection("verifiedUsers").doc(userId);
    const userDoc = await userDocRef.get();
    db.collection("verifiedUsers").doc(userId).update({
        ...userDoc.data(), teamId: teamDocRef.id
    });

    // Add captain to channels.
    await voiceChannel.permissionOverwrites.create(userId, {VIEW_CHANNEL: true});
    await textChannel.permissionOverwrites.create(userId, {VIEW_CHANNEL: true});
    await textChannel.send(`<@${userId}> ✅ This is your team channel! To invite people to this channel, use the team invite command!`);
    return teamNumber;
};

const deleteTeam = async (user, api) => {
    const userDocRef = db.collection("verifiedUsers").doc(user.id);
    const userDoc = await userDocRef.get();
    const teamId = userDoc.teamId;

    // Mark team as inactive.
    const teamDocRef = db.collection("teams").doc(teamId);
    const teamDoc = await teamDocRef.get();
    await teamDocRef.update({
        ...teamDoc.data(), active: false
    });

    // Get team voice and text channel.
    const voiceChannel = await api.channels.fetch(teamDoc.voice);
    const textChannel = await api.channels.fetch(teamDoc.text);

    // Loop through each user and...
    for(const teamMemberId of teamDoc.members) {
        // Delete the user's team entry.
        const teamMemberDocRef = db.collection("verifiedUsers").doc(teamMemberId);
        const teamMemberDoc = await teamMemberDocRef.get();
        await teamMemberDocRef.update({
            ...teamMemberDoc.data(), teamId: null
        });

        // DM each team member.
        const teamMember = await api.users.fetch(teamMemberId);
        const dm = await teamMember.createDM();
        await dm.send("❌ Your team has been deleted!");

        // Delete each team member from the text+voice channel.
        await voiceChannel.permissionOverwrites.delete(teamMemberId);
        await textChannel.permissionOverwrites.delete(teamMemberId);
    }

    return team;
};

const getTeam = async (teamId) => {
    const teamDocRef = db.collection("teams").doc(teamId);
    return (await teamDocRef.get()).data();
};

const getTeamFromUser = async (user) => {
    const userDocRef = db.collection("verifiedUsers").doc(user.id);
    const userDoc = await userDocRef.get();
    const teamId = userDoc.teamId;

    const teamDocRef = db.collection("teams").doc(teamId);
    return (await teamDocRef.get()).data();
};

const leaveTeam = (team, verifiedUser) => {
    //TODO: announce in team channel.


    return team, verifiedUser;
};

const addUserToTeam = async (teamId, captainId, targetId, api) => {
    // Update user's team in firestore.
    const targetUserDocRef = db.collection("verifiedUsers").doc(targetId);
    const targetUserDoc = await targetUserDocRef.get();
    db.collection("verifiedUsers").doc(targetId).update({
        ...targetUserDoc.data(), teamId: teamId
    });

    // Add user to team on firestore.
    const teamDocRef = db.collection("teams").doc(teamId);
    const teamDoc = await teamDocRef.get();
    await teamDocRef.update({
        ...teamDoc.data(), members: [...teamDoc.data().members, targetId]
    });

    // Add new user to channels.
    const voiceChannel = await api.channels.fetch(teamDoc.data().voice);
    const textChannel = await api.channels.fetch(teamDoc.data().text);
    await voiceChannel.permissionOverwrites.create(targetId, {VIEW_CHANNEL: true});
    await textChannel.permissionOverwrites.create(targetId, {VIEW_CHANNEL: true});
    await textChannel.send(`<@${targetId}> ✅ You have been added to the team!`);
    return true;
};

const getTextCategoryForNewTeam = async (server) => {
    let freeCategory;
    let findFreeCategory = true;
    let totalChannels = 0;

    for(const categoryId of config.discord.teamTextCategoryIds) {
        const category = await server.channels.fetch(categoryId);
        totalChannels += category.children.size;
        
        if(findFreeCategory && category.children.size <= 45) {
            freeCategory = category;
            findFreeCategory = false;
        }
    }

    return {category: freeCategory, totalChannels: totalChannels};
};

const getVoiceCategoryForNewTeam = async (server) => {
    let freeCategory;
    let findFreeCategory = true;

    for(const categoryId of config.discord.teamVoiceCategoryIds) {
        const category = await server.channels.fetch(categoryId);
        if(findFreeCategory && category.children.size <= 45) {
            freeCategory = category;
            findFreeCategory = false;
        }
    }

    return freeCategory;
};

module.exports = { addUserToTeam, createTeam, deleteTeam, getTeam, leaveTeam };