const { getColumn, getRow } = require("./sheets"); 
const { db } = require("./firestore");
const { config } = require("../config");

const getVerifiedUser = async (userId) => {
    const docRef = db.collection("verifiedUsers").doc(userId);
    const doc = await docRef.get();
    return doc.exists ? doc.data() : null;
};

const getSheetsUser = async (userId) => {
    const emailColumn = getColumn("E");
    console.log(emailColumn);
    // Get email column 
    // Find which row the email appears on.
    // get the row index.
    // get the email row at that index.
    // return the row.
    return userId;
};

const addVerifiedUser = async (email, member) => {
    try {
        await db.collection("verifiedUsers").doc(member.id)
            .set({ email: email, teamId: null, teamRequests: [], mc: [] });
        
        await member.roles.add(config.discord.verifiedRoleId);
        return true;

    } catch (error) { return false; }
};

module.exports = { getVerifiedUser, getSheetsUser, addVerifiedUser };