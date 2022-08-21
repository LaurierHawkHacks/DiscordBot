const { getColumn } = require("./sheets");
const { db } = require("./firestore");
const { config } = require("../config");

const getVerifiedUser = async (userId) => {
    const docRef = db.collection("verifiedUsers").doc(userId);
    const doc = await docRef.get();
    return doc.exists ? doc.data() : null;
};

const isAccepted = async (userId, email) => {
    const emailColumn = await getColumn("A", config.gsheets.spreadsheetId, "Accepted Emails");
    return emailColumn.includes(email);
};

const addVerifiedUser = async (email, member) => {
    await db.collection("verifiedUsers").doc(member.id)
        .set({ email: email, teamId: null, teamRequests: [], mc: [] });

    setTimeout(async () => {    
        await member.roles.add(config.discord.verifiedRoleId);
    }, 5000);

    return true;
};

module.exports = { getVerifiedUser, isAccepted, addVerifiedUser };
