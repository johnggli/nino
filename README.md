<h1 align="center">💬 Nino - AI Chatbot</h1>
<h3 align="center">An artificial intelligence chatbot able to learn. Made with html, css, javascript and firebase.</h3>

<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/johnggli/nino?color=%23FF669D">
  
  <a href="https://www.linkedin.com/in/johnggli/">
    <img alt="Made by" src="https://img.shields.io/badge/made%20by-John%20Emerson-%23FF669D">
  </a>
  
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/johnggli/nino?color=%23FF669D">
  
  <a href="https://github.com/johnggli/nino/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/johnggli/nino?color=%23FF669D">
  </a>
</p>

<p align="center">
  <a href="#-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-to-contribute">How to contribute</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

---

<p align="center">
  <img alt="Layout" src="https://user-images.githubusercontent.com/43749971/111331199-6c278600-864f-11eb-9548-a959db021f67.gif">
</p>

---

## 💡 About the project

- This is an open source project of an artificial intelligence chatbot capable of learning new answers. This project was done using html, css (Bootstrap 4), javascript (JQuery) and Firebase.

- [Live demo](https://ninoai.netlify.app)

## 🚀 Getting started

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
  API_KEY: '000000000000000000000000000000000000000',
  AUTH_DOMAIN: 'nino.firebaseapp.com',
  DATABASE_URL: 'https://nino-default-rtdb.firebaseio.com',
  PROJECT_ID: 'nino',
  STORAGE_BUCKET: 'nino.appspot.com',
  MESSAGING_SENDER_ID: '000000000000',
  APP_ID: '1:000000000000:web:0000000000000000000000'
};
```
- Now, open the `index.html` file in your browser and have fun!

## 🤔 How to contribute

- Fork this repository;
- Create a branch with your feature: `git checkout -b my-feature`;
- Commit your changes: `git commit -m "feat: my new feature"`;
- Push to your branch: `git push origin my-feature`.

Once your pull request has been merged, you can delete your branch.

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE.md) file for more details.

---

Made with ❤️ by John Emerson :wave: [Get in touch](https://johnggli.github.io/linktree)
