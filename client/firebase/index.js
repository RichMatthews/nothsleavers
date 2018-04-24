import firebase from 'firebase';
var config = {
  apiKey: "AIzaSyChBaABpW7dJaZ5Um4wHwUf7XsaYnGRlYQ",
  authDomain: "noths-leavers.firebaseapp.com",
  databaseURL: "https://noths-leavers.firebaseio.com",
  projectId: "noths-leavers",
  storageBucket: "noths-leavers.appspot.com",
  messagingSenderId: "859053639501"
};
const fire = firebase.initializeApp(config);
export default fire;
