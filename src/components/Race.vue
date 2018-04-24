<template>
  <div>
    <div>
      <nav>
        <div class="header">
          <img src="../assets/logo.png" class="logo" alt="Typeracer" width="50px">
          <a href="http://localhost:8080/#/race" class="logo">Typeracer</a>
          <div class="header-right">
            <a class="active" href="#home">Home</a>
            <a target="_blank" href="http://aashutoshrathi.co">About</a>
            <a href='' @click="logOut()" style="align:right;">Signout</a>
            <img width="47px" :src="this.userPic">
            <a>{{ this.username }}</a>
          </div>
        </div>
      </nav>
      <main>
        <router-view></router-view>
      </main>
    </div>

    <div class="bada-baxa-para card bg-light text-dark">
      <span v-show="started">Time Left: {{this.timerDetails}}</span>
      <span v-show="started">Speed: {{this.speed}} WPM</span>
      <h4 v-show="finished">{{this.username}} completed race with {{this.speed}} WPM</h4>
			<!-- <span> Word: {{ currentWord + 1 }}/{{ para[currentPara].words.length }}, Letter: {{ currentLetter }}/{{ para[currentPara].words[currentWord].letters.length }} </span>       -->
      <div v-show="!finished" class="card-body unselectable parag">
			  <span class="word" :class="{complete: word.status == 'complete', next: index == currentWord}" :data-id="index" v-for="(word, index) in para[currentPara].words" :key="index">
					<span class="letter" :data-id="index" v-for="(letter, index) in word.letters" :key="index" v-text="letter.letter" :class="{error: letter.status == 'error', complete: letter.status == 'complete'}"></span>
			  </span>
      </div>
    </div>

      <!-- <div class="chatbox">
        <div class="chatlogs">
          <div v-for="item in anArray" :key="item.id">
            <span class="chat-name"> {{item.name}} </span>
            <div class="chat friend">
              <img class="user-photo" v-bind:src="item.photo_url" />
              <div class="chat-message">
                <p>
                  {{item.message}}
                </p>
                <p>
                  <span class="chat-time"> {{item.timestamp | formatDate}}</span>
                </p>
              </div>
            </div>
          </div>
        </div> -->

        <!-- Disabled editors like Grammarly using data-gramm_editor :p-->
        <input type="text" data-gramm_editor="false" class="inp" v-model="input" @input="typecheck">
      </div>
</template>

<script>
/*eslint-disable*/

import firebase from '../firebase/index.js'
import Vue from 'vue'
import Vuefire from 'vuefire'
import dateFilter from '../utils/filter.js';
import moment from 'moment'
Vue.use(Vuefire);

var db = firebase.database()
var paraRef = db.ref('paragraphs')

export default {
  name: 'race',
  data: function() {
    return {
      loading: true,
      msgPara: ['This is one is hardcoded paragraph.'],
      para: [],
      Paras: [],
      input: '',
      currentPara: 0,
      currentWord: 0,
      currentLetter: 0,
      username: '',
      userPic: '',
      timerDetails: '',
      started: false,
      finished: false,
      speed: 0,
    };
  },

  filters: {
    dateFilter,
  },

  methods: {
    logOut() {
      firebase.auth().signOut()
    },

    addComment() {
      if (this.newComment !== '') {
        this.comment = this.newComment.trim();
        raceRef.push({
          message: this.comment,
          name: this.getUserName(),
          timestamp: moment().unix(),
          userId: this.getUserId(),
          photo_url:this.getPhotoURL()
        });
        this.newComment = "";
      }
    },

    addPara() {
      if (this.newPara !== '') {
        this.comment = this.newPara.trim();
        paraRef.push({
          message: this.comment,
          name: this.getUserName(),
          timestamp: moment().unix(),
          userId: this.getUserId(),
        });
        this.newPara = "";
      }
    },

    addRaceInfo() {
      raceRef.push({
        user: {
          uid: firebase.auth().currentUser.uid,
          name: firebase.auth().currentUser.displayName,
          dp: firebase.auth().currentUser.photoURL,
          speed: 0,
        },
        paraUsed: this.currentPara,
      })
    },
    
    getUserName() {
      return new Promise(function (resolve, reject) {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            resolve(user.displayName);
          } else {
            reject(Error('It broke'));
          }
        });
      });
    },

    getPhotoURL() {
      return new Promise(function (resolve, reject) {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            resolve(user.photoURL);
          } else {
            reject(Error('It broke'));
          }
        });
      });
    },

    timerStart(seconds) {
      clearInterval(countdown);
      const now = Date.now();
      this.started = true;
      const then = now + seconds * 1000;
      this.displayTimeLeft(seconds);
      var countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if (secondsLeft < 0 || this.finished) {
          clearInterval(countdown);
          this.started = false;
          return;
        }
        this.displayTimeLeft(secondsLeft);
      }, 1000);
    },

    displayTimeLeft(seconds) {
      const hour = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainderSeconds = seconds % 60;
      const display = `${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
      this.timerDetails = display;
      const mins = 1.99 - (remainderSeconds/60 + minutes);
      if(Math.floor((this.currentWord + 1)/(mins)) > 0) {
        this.speed = Math.floor((this.currentWord + 1)/(mins));
      }
      var finish = this.currentWord + 1 == this.para[this.currentPara].words.length && this.currentLetter == this.para[this.currentPara].words[this.currentWord].letters.length;
      if (hour === 0 && minutes === 0 && remainderSeconds === 0 || finish ) {
        console.log("You completed race with", this.speed, " WPM");
        this.finished = true;
      }
    },

    typecheck(){
					Array.from(this.letters).forEach((letter, index) => {
							letter.status = letter.letter == this.input[index] ? 'complete' : 'error'
          })
          if(this.letters[0].status == "complete" && !this.started) {
            this.timerStart(120);
          }
					if (this.input == this.word + ' '){
							this.currentWord = this.next(this.currentWord, this.para[this.currentPara].words)
							this.input = ''
					}
					this.currentLetter = Array.from(this.letters)
					.reduce(function(accum, current) {
							return accum + (current.status == 'complete' ? 1 : 0)
					}, 0)
			},
			next(current, array){
					return current < array.length - 1 ? ++current : current
			},
			changeText(){
					this.reset()
			},
			reset(){
					this.currentWord = 0
					this.currentLetter = 0
					this.input = ''
      },
  },
  
  mounted() {
    this.Paras.forEach((eachObj) => {
      this.msgPara.push(eachObj.message);
      console.log('Kya ho rha hai yrr? -_-');
    });
  },

  beforeMount () {
    this.getUserName().then((param) => {
      this.username = param;
    });

    this.getPhotoURL().then((param) => {
      this.userPic = param;
    }); 

    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        this.$bindAsArray('Paras', paraRef);
        console.log('Kya ho rha hai yrr? -_-');
        console.log('This is paras: ', this.Paras); 
      });
    });  
  },

  created: function () {
      // console.log(this.Paras);

      this.currentPara = Math.floor(Math.random()*this.msgPara.length)
			this.para = this.msgPara.map(x => {
					return {
							status: '',
							fullPara: x,
							words: x.split(' ').map(x => {
									return {
											status: '',
											fullWord: x,
											letters: x.split('').map(x => {
													return {
															status: '',
															letter: x
													}
											})
									}
							})
					}
			})
	},
	computed: {
			letters(){
					return this.para[this.currentPara].words[this.currentWord].letters
			},
			word(){
					return this.para[this.currentPara].words[this.currentWord].fullWord
      },
	}
}
</script>
<style>
/* Style the header with a grey background and some padding */
.header {
  overflow: hidden;
  background-color: #f1f1f1;
  padding: 10px 10px;
}

.btn {  
  display: inline-block;
  margin: 5% 45% 0% 45%;
  width: 7%;
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

.parag {
  width: 60%;
  overflow: inherit;
}

* {
    box-sizing: border-box;
}

:focus {
    outline: none;
}

input {
    font-family: monospace;
    font-size: 20px;
}

.word {
    margin-right: 10px;
    display: inline-block;
    border-bottom: 3px solid transparent;
}

.word.next {
    border-color: #f3ea6c;
}

.letter.complete {
    color: #29d429;
}

.letter.error {
    color: red;
}

.bada-baxa-para {
    align-items: center;
}

.bada-baxa-time {
    align-items: right;
}

.bada-baxa-speed {
    align-items: left;
}
</style>
