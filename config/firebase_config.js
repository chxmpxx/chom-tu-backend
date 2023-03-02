const admin = require("firebase-admin");
const serviceAccount = require("../key/firebase_key.json");
const { storageBucket } = require('../key/firebase_storage');

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageBucket
});

module.exports = firebaseApp