import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyA-4UQyJ2wfj9OfgX4zkTQeFscFxGQ_agE",
  authDomain: "localhost",
  databaseURL: "https://hoops-21a72.firebaseio.com",
  storageBucket: "hoops-21a72.appspot.com",
};

export default firebase.initializeApp(firebaseConfig);
