import firebase from './index'

export function twitterAuth () {
  const provider = new firebase.auth.TwitterAuthProvider()
    // const result = auth().signInWithPopup(provider);
  return firebase.auth().signInWithRedirect(provider).then((result) => {
    console.log('Auth worked!', result)
    this.$router.push('/race')
  }, (error) => {
    console.log('Unable to auth', error)
  })
}

export function GoogleAuth () {
  const provider = new firebase.auth.GoogleAuthProvider()
  // const result = auth().signInWithPopup(provider);
  return firebase.auth().signInWithRedirect(provider).then((result) => {
    console.log('Auth worked!', result)
    this.$router.push('/race')
  }, (error) => {
    console.log('Unable to auth', error)
  })
}

export function GitAuth () {
  const provider = new firebase.auth.GithubAuthProvider()
  // const result = auth().signInWithPopup(provider);
  return firebase.auth().signInWithRedirect(provider).then((result) => {
    console.log('Auth worked!', result)
    this.$router.push('/race')
  }, (error) => {
    console.log('Unable to auth', error)
  })
}

