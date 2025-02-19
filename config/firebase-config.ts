import admin from "firebase-admin";
import serviceAccountKey from "./serviceAccountKey";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount),
});

export default admin;
