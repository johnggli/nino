<h1 align="center">:speech_balloon: Nino - AI Chatbot</h1>
<h3 align="center">An artificial intelligence chatbot made with html, css and javascript.</h3>

<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/JohnEmerson1406/nino?color=%23FF669D">
  
  <a href="https://www.linkedin.com/in/johnemerson1406/">
    <img alt="Made by" src="https://img.shields.io/badge/made%20by-John%20Emerson-%23FF669D">
  </a>
  
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/JohnEmerson1406/nino?color=%23FF669D">
  
  <a href="https://github.com/JohnEmerson1406/nino/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/JohnEmerson1406/nino?color=%23FF669D">
  </a>
</p>

<p align="center">
  <a href="#bulb-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#rocket-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#star2-extras">Get in touch</a>
</p>

---

<p align="center">
  <img alt="Layout" src="https://user-images.githubusercontent.com/43749971/111331199-6c278600-864f-11eb-9548-a959db021f67.gif">
</p>

---

## :bulb: About the project

- This is an open source project of an artificial intelligence chatbot capable of learning new answers. This project was done using html, css (Bootstrap 4), javascript (JQuery) and Firebase.

- [Live demo](https://ninoai.netlify.app)

## :rocket: Getting started

- First, go to the [Firebase Console](https://console.firebase.google.com) and create a new project.
- Once created, click on `add app` and select the `web` option, give the app a nickname and then copy the app’s configuration, which looks something like this:
```javascript
const firebaseConfig = {
  apiKey: "000000000000000000000000000000000000000",
  authDomain: "nino.firebaseapp.com",
  databaseURL: "https://nino-default-rtdb.firebaseio.com",
  projectId: "nino",
  storageBucket: "nino.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};
```
- Finally, create a file called `config.js` inside the `js` folder and paste the configuration into it, exactly as below:
```javascript
// js/config.js

var config = {
  apiKey: "000000000000000000000000000000000000000",
  authDomain: "nino.firebaseapp.com",
  databaseURL: "https://nino-default-rtdb.firebaseio.com",
  projectId: "nino",
  storageBucket: "nino.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};
```
- Now, open the `index.html` file in your browser and have fun!

---

## :star2: Extras
- [Shields.io](https://shields.io/)
- [Github Emojis](https://gist.github.com/rxaviers/7360908)

---

Made with ♥ by John Emerson :wave: [Get in touch](https://johnemerson1406.github.io/linktree)
