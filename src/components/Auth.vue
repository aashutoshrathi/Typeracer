<template>
  <div id="app">
    <div>
      <nav>
        <div class="header">
          <img src="../assets/logo.png" class="logo" alt="Typeracer" width="50px">
          <a class="logo text">Typeracer</a>
          <div class="header-right">
            <a class="active" href="#home">Home</a>
            <a target="_blank" href="http://aashutoshrathi.co">About</a>
          </div>
        </div>
      </nav>
      <main>
        <img src="../assets/logo.png" alt="Vue.js PWA for TR">
        <router-view></router-view>
      </main>
    </div>
    <div id="login">
      <form>
        <h1 class ="text">Typeracer</h1>
        <div class="form-group">
          <button class="btn btn-info btn-block login" @click="twitterAuth()"> 
            Login with <i class="fab fa-twitter"></i>
          </button>
          <button class="btn btn-danger btn-block login" @click="GoogleAuth()"> 
            Login with <i class="fab fa-google"></i>
          </button>
          <button class="btn btn-dark btn-block login" @click="GitAuth()"> 
            Login with <i class="fab fa-github"></i>
          </button>
          <button class="btn btn-primary btn-block login" @click="twitterAuth()"> 
            Login with <i class="fab fa-facebook"></i>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
 /* eslint-disable */
import {config} from '../firebase/index.js'
import {
  twitterAuth, GoogleAuth, GitAuth
} from '../firebase/auth.js'
export default {
  name: 'auth',
  data() {
    return {
      msg: ''
    }
  },
  methods: {
    twitterAuth() {
      twitterAuth ()
    },
    GoogleAuth() {
      GoogleAuth ()
    },
    GitAuth() {
      GitAuth ()
    }
  }
}
</script>

<style>
.text {
  text-align: center;
  font-family: Helvetica, sans-serif;
}

/* Style the header with a grey background and some padding */
.header {
  overflow: hidden;
  background-color: #f1f1f1;
  padding: 10px 10px;
}

/* Style the header links */
.header a {
  float: left;
  color: black;
  text-align: center;
  padding: 12px;
  text-decoration: none;
  font-size: 18px; 
  line-height: 25px;
  border-radius: 4px;
}

/* Style the logo link (notice that we set the same value of line-height and font-size to prevent the header to increase when the font gets bigger */
.header a.logo {
  font-size: 25px;
  font-weight: bold;
}

/* Change the background color on mouse-over */
.header a:hover {
  background-color: #ddd;
  color: black;
}

/* Style the active/current link*/
.header a.active {
  background-color: dodgerblue;
  color: white;
}

/* Float the link section to the right */
.header-right {
  float: right;
}

/* Add media queries for responsiveness - when the screen is 500px wide or less, stack the links on top of each other */ 
@media screen and (max-width: 500px) {
  .header a {
    float: none;
    display: block;
    text-align: left;
  }
  .header-right {
    float: none;
  }
}

.unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.inp:focus {
    border: 3px solid #555;
}

.inp {
    width: 50%;
    padding: 12px 20px;
    margin: 5% 25%  0 25%;
    box-sizing: border-box;
    border: 3px solid #ccc;
    -webkit-transition: 0.5s;
    transition: 0.5s;
    outline: none;
}

.btn {  
  margin: 5% 45% 0% 45%;
}

.parag {
  width: 60%;
  overflow: inherit;
}

.login {
  width: 10%;
}

</style>

