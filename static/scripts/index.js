import words from './word-generator.js'

const body = document.getElementsByTagName("BODY")[0];
const wordsDisplayElement = document.getElementById('words');
const scoreElement = document.getElementById('score');
const timeDisplayElement = document.getElementById('timeElapsed');
const wpmDisplayElement = document.getElementById('wpm');
const cpmDisplayElement = document.getElementById('cpm');
const incorDisplayElement = document.getElementById('incor');
const overlayElement = document.querySelector('.overlay');
const darkModeCheck = document.getElementById('hacker');
const wordCountSlider = document.getElementById('wordArrayLength');
const progressDisplayElement = document.getElementById('progress');
const remainingDisplayElement = document.getElementById('remainingWords');

let letterSpan = wordsDisplayElement.querySelectorAll('span');
let index = 0;
let notChars = ['Shift', 'Control', 'Meta', 'CapsLock', 'Tab',
  'Escape', 'AudioVolumeUp', 'AudioVolumeUp',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  'Insert', 'Delete', 'Backspace', 'Enter', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'
];
let charCount = 1;
let timeElapsed = 0;
let incorrect = 0;
let startTime;
let timer;
let incorrectRatio;
let remaining;

// getting data from localstorage
let localStorage = window.localStorage;
let theme = localStorage.getItem("theme");
let score = localStorage.getItem("score");
let wpm = localStorage.getItem("wpm");
let cpm = localStorage.getItem("cpm");
let wordCount = localStorage.getItem("wordCount");

score = score ? parseInt(score) : 0;
wpm = wpm ? parseInt(wpm) : 0;
cpm = cpm ? parseInt(cpm) : 0;
wordCount = wordCount ? parseInt(wordCount) : 10;
remaining = wordCount;

scoreElement.innerText = score;
wpmDisplayElement.innerText = wpm;
cpmDisplayElement.innerText = cpm;
wordCountSlider.setAttribute('value', `${wordCount}`);

body.classList.toggle(theme);
if (theme === "dark") {
  darkModeCheck.checked = true;
}

darkModeCheck.addEventListener("change", event => {
  document.getElementById('focus').focus();
  body.classList.toggle('dark');

  if (darkModeCheck.checked) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
})

wordCountSlider.addEventListener("change", event => {
  wordCount = parseInt(wordCountSlider.value);
  localStorage.setItem("wordCount", `${wordCount}`);
  index = 0;
  remainingDisplayElement.innerText = wordCount;
  if (!overlayElement.classList.contains('inactive')) {
    renderNewSentence();
  }
})

document.addEventListener('keydown', event => {

  if (overlayElement.classList.contains('inactive')) {
    if (event.code == 'Space') {
      renderNewSentence();
      document.getElementById('startHeading').innerText = 'Press ESC to quit';
      overlayElement.classList.toggle('inactive');
      progressDisplayElement.style.display = 'block';
      remainingDisplayElement.innerText = wordCount;
    }
  } else {
    incorDisplayElement.innerText = incorrect;

    if (event.key == 'Escape') {
      document.getElementById('startHeading').innerText = 'Press space to start';
      wordsDisplayElement.innerHTML = null;
      overlayElement.classList.toggle('inactive');
      progressDisplayElement.style.display = 'none';
      clearInterval(timer);
      index = 0;
      timeDisplayElement.innerText = 0;
    }

    if (!notChars.includes(event.key)) {
      if (index === 0) { // the game starts only when the user presses a character key for the first time
        startTime = new Date();
        timer = setInterval(() => {
          let endTime = new Date();
          timeElapsed = (endTime - startTime) / 1000;
          timeDisplayElement.innerText = Math.floor(timeElapsed);
        }, 1000);
      }

      if (letterSpan[index].getAttribute('name') == event.key) {
        if (event.code == 'Space') {
          remaining--;
          remainingDisplayElement.innerText = remaining;
        }
        charCount++;
        letterSpan[index].remove();
        index++;
        if (index < letterSpan.length) {
          letterSpan[index].classList.add('focused');
        }
      } else {
        letterSpan[index].classList.add('incorrect-temp');
        incorrect++;
      }
    }

    if (index == letterSpan.length) {
      index = 0;
      wpm = Math.round((60 * wordCount / timeElapsed));
      cpm = Math.round((60 * charCount / timeElapsed));
      incorrectRatio = incorrect / charCount * 100;
      score = score ? Math.floor((score + (wpm * 50 - incorrectRatio * 40)) / 2) : (wpm * 50 - incorrect * 30);

      localStorage.setItem("score", `${score}`);
      localStorage.setItem("wpm", `${wpm}`);
      localStorage.setItem("cpm", `${cpm}`);

      scoreElement.innerText = score;
      wpmDisplayElement.innerText = wpm;
      cpmDisplayElement.innerText = cpm;

      clearInterval(timer);
      timeElapsed = 0;
      timeDisplayElement.innerText = timeElapsed;

      renderNewSentence();
      incorrect = 0;
    }
  }
});

const renderNewSentence = () => {
  wordsDisplayElement.innerHTML = null;
  startTime = new Date();
  charCount = 0;
  let sentence = words(wordCount).join(' ').split('');

  sentence.forEach(letter => {
    let letterElement = document.createElement('span');
    if (letter === ' ') {
      letterElement.innerText = '_';
      letterElement.setAttribute('name', ' ');
    } else {
      letterElement.innerText = letter;
      letterElement.setAttribute('name', letter)
    }
    wordsDisplayElement.appendChild(letterElement);
  })

  letterSpan = wordsDisplayElement.querySelectorAll('span');
  letterSpan[index].classList.add('focused');
  remaining = wordCount;
  remainingDisplayElement.innerHTML = remaining;
}