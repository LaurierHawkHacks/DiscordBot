const team = require("../commands/team");
const { db } = require("./firestore");
const { config } = require("../config");

const createTeam = async (user, server) => {
    // Get the team category and calculate the new team's name.
    const category = await server.channels.fetch(config.discord.teamCategoryId);
    const teamNumber = Math.floor( (category.children.size - 2) / 2);

    // Adds new team to teams col.
    const teamnDocRef = await db.collection("teams").add({
        captain: user.id,
        members: [user.id],
        name: teamNumber,
        active: true,
    });
    const userDocRef = await db.collection("verifiedUsers").doc(user.id).get();

    // Mark the user as being in a team.
    db.collections("verifiedUsers").doc(user.id).update({
        email: userDocRef.doc().email, team: teamnDocRef, teamRequests: userDocRef.doc().email });

    // Create team channel.
    const voiceChannel = await category.createChannel(`Team #${teamNumber}`, {type: "GUILD_VOICE"});
    const textChannel = await category.createChannel(`team-#${teamNumber}`, {type: "GUILD_TEXT"});

    // Add captain to channels.
    await voiceChannel.permissionOverwrites.create(user, {VIEW_CHANNEL: true});
    await textChannel.permissionOverwrites.create(user, {VIEW_CHANNEL: true});
    await textChannel.send(`<@${user.id}> ✔️ This is your team channel! To invite people to this channel, use the team invite command!`);
    return true;
};

const deleteTeam = async (user, api) => {
    const userDocRef = db.collection("verifiedUsers").doc(user.id);
    const userDoc = await userDocRef.get();
    const teamId = userDoc.teamId;

    // Mark team as inactive.
    const teamDocRef = db.collection("teams").doc(teamId);
    const teamDoc = await teamDocRef.get();
    await db.collection("teams").doc(teamId).update({
        ...teamDoc, active: false
    });

    // Loop through each user and delete their team entry
    for(const teamMemberId of teamDoc.members) {
        const teamMemberDocRef = db.collection("verifiedUsers").doc(teamMemberId);
        const teamMemberDoc = await teamMemberDocRef.get();

        await db.collection("verifiedUsers").doc(teamMemberId).update({
            ...teamMemberDoc, teamId: null
        });

        // DM each team member.
        const teamMember = await api.users.fetch(teamMemberId);
        const dm = await teamMember.createDM();
        await dm.send("❌ Your team has been deleted!");
    }
            
    return team;
};

const getTeam = async (teamId) => {
    const teamDocRef = db.collection("teams").doc(teamId);
    return await teamDocRef.get();
};

const getTeamFromUser = async (user) => {
    const userDocRef = db.collection("verifiedUsers").doc(user.id);
    const userDoc = await userDocRef.get();
    const teamId = userDoc.teamId;

    const teamDocRef = db.collection("teams").doc(teamId);
    return await teamDocRef.get();
};

const leaveTeam = (team, verifiedUser) => {
    //TODO: announce in team channel.


    return team, verifiedUser;
};



const addUserToTeam = (team, captain, target, api) => {
    

    //TODO: send DM to invitee.
    //TODO: if accepted, check if they can still join AND add to team and send dm in team channel.
    //TODO: if rejected, send dm in team channel.
    
    return team, captain, target;
};

module.exports = { createTeam, deleteTeam, getTeam, leaveTeam };