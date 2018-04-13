import firebase from 'firebase'

export const config = {
  apiKey: 'AIzaSyBn_r5Q2LDN7GGFu2iWe4oed4w5wbpCX18',
  authDomain: 'vue-chat-70b40.firebaseapp.com',
  databaseURL: 'https://vue-chat-70b40.firebaseio.com',
  projectId: 'vue-chat-70b40',
  storageBucket: '',
  messagingSenderId: '401776693411'
}

firebase.initializeApp(config)

var firebaseRef = firebase.database()
export default firebase
export var paraRef = firebaseRef.ref('paragraphs')
export var raceRef = firebaseRef.ref('race')
