
const firebaseConfig = {
  apiKey: "AIzaSyDF_cgckRbWrmLC9ZNkEjK1a4_hcIz_AWs",
  authDomain: "khoisu-66a85.firebaseapp.com",
  projectId: "khoisu-66a85",
  storageBucket: "khoisu-66a85.appspot.com",
  messagingSenderId: "899756752441",
  appId: "1:899756752441:web:4565319613da6af95dd7e8",
  measurementId: "G-BN9B120N76"
};

const autoBind = require('auto-bind');

class FirebaseAdminApp {
  constructor() {
    this.admin = require("firebase-admin");
    this.admin.initializeApp({ credential: this.admin.credential.cert(credential), storageBucket: 'khoisu-66a85.appspot.com' });
    autoBind(this);
  }

  getAdmin() {
    return this.admin;
  }
}

module.exports = new FirebaseAdminApp();

