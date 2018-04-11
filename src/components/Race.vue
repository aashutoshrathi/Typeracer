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
            <img width="47px" :src=getPhotoURL()>
            <a>{{ getUserName() }}</a>
          </div>
        </div>
      </nav>
      <main>
        <router-view></router-view>
      </main>
    </div>

    <div class="bada-baxa card bg-light text-dark">
			<span> Word: {{ currentWord + 1 }}/{{ para[currentPara].words.length }}, Letter: {{ currentLetter }}/{{ para[currentPara].words[currentWord].letters.length }} </span>      
      <div class="card-body unselectable parag">
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

import firebase, {
  paraRef
} from '../firebase/index.js'
import Vue from 'vue'
import Vuefire from 'vuefire'
import dateFilter from '../utils/filter.js';
import moment from 'moment'
Vue.use(Vuefire);

export default {
  name: 'race',
  data: function() {
    return {
      loading: true,
      msgPara: [],
      para: [],
      input: '',
      currentPara: 0,
      currentWord: 0,
      currentLetter: 0,
    };
  },

  firebase: {
    // can bind to either a direct Firebase reference or a query
    //anArray: raceRef,
    Paras: paraRef,
    // optionally provide the cancelCallback
    cancelCallback: function () {
    },
    // this is called once the data has been retrieved from firebase
    readyCallback: function () {

    }
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

    getUserId() {
      return firebase.auth().currentUser.uid;
    },
    getUserName() {
      return firebase.auth().currentUser.displayName;
    },
    getPhotoURL() {
      if(firebase.auth().currentUser) {
        return firebase.auth().currentUser.photoURL;
      }
    },

    typecheck(){
					Array.from(this.letters).forEach((letter, index) => {
							letter.status = letter.letter == this.input[index] ? 'complete' : 'error'
					})
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
			}
  },
  created: function () {
      this.Paras.forEach((eachObj) => {
        this.msgPara.push(eachObj.message);
      });

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

.bada-baxa {
    align-items: center;
}
</style>
