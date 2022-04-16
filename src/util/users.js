const firebase = require("firebase");
require("firebase/firestore");
const firebaseConfig = {
    // ...
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const fs = require("node:fs");
const readline = require("readline");
const { google } = require("googleapis");
const sheets = google.sheets({version: "v4", auth});



const getVerifiedUser = async (userId) => {
    return userId;

};

const addVerifiedUser = async(member) => {
    return member;
};

module.exports = { getVerifiedUser, addVerifiedUser };