// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth"

// const firebaseConfig = {
//   apiKey: "AIzaSyDQULqCQ4ekGxClhUWo57_KdLjsgolovok",
//   authDomain: "crypto-alerts-7543c.firebaseapp.com",
//   projectId: "crypto-alerts-7543c",
//   storageBucket: "crypto-alerts-7543c.appspot.com",
//   messagingSenderId: "537913700313",
//   appId: "1:537913700313:web:4d2bdcaef14c61878573c8"
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);

import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDQULqCQ4ekGxClhUWo57_KdLjsgolovok",
  authDomain: "crypto-alerts-7543c.firebaseapp.com",
  projectId: "crypto-alerts-7543c",
  storageBucket: "crypto-alerts-7543c.appspot.com",
  messagingSenderId: "537913700313",
  appId: "1:537913700313:web:4d2bdcaef14c61878573c8"
};

// initialise Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export { auth };