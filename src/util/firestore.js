const { config } = require("../config");
const firebase = require("firebase");
require("firebase/firestore");

const firebaseConfig = config.firebaseConfig;
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports = { firebase, db };