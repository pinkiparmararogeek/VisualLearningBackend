const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json.json'); // Relative to this file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;