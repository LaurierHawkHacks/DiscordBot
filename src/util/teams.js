
const createTeam = (verifiedUser) => {
    //TODO: create new entry in DB
    //TODO: assign user as captain
    //TODO: mark user as being in a team

    return verifiedUser;
};

const deleteTeam = (team) => {
    //TODO: mark team as abandoned.
    //TODO: Dm all team members.
            
    return team;
};

const getTeam = (teamId) => {
    return teamId;
};

const leaveTeam = (team, verifiedUser) => {
    //TODO: announce in team channel.

    return team, verifiedUser;
};



const inviteUserToTeam = (team, captain, target) => {
    //TODO: add request to user list.
    //TODO: send DM to invitee.
    //TODO: if accepted, check if they can still join AND add to team and send dm in team channel.
    //TODO: if rejected, send dm in team channel.
    
    return team, captain, target;
};

module.exports = { createTeam, deleteTeam, getTeam, inviteUserToTeam, leaveTeam };