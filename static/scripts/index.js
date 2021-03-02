import words from './word-generator.js'

const wordsDisplayElement = document.getElementById('words');
const scoreElement = document.getElementById('score');
const timeDisplayElement = document.getElementById('timeElapsed');
const wpmDisplayElement = document.getElementById('wpm');
const cpmDisplayElement = document.getElementById('cpm');
const incorDisplayElement = document.getElementById('incor');
const overlayElement = document.querySelector('.overlay');
// const darkModeCheck = document.getElementById('hacker');
let letterSpan = wordsDisplayElement.querySelectorAll('span');
let index = 0;
let notChars = ['Shift', 'Control', 'Meta', 'CapsLock', 'Tab',
  'Escape', 'AudioVolumeUp', 'AudioVolumeUp',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  'Insert', 'Delete', 'Backspace', 'Enter', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'
];
let score = 0;
let charCount = 1;
let wordCount = 15;
let timeElapsed = 0;
let incorrect = 0;
let startTime;
let wpm = 0;
let cpm = 0;
let timer;

document.addEventListener('keydown', event => {

  if (overlayElement.classList.contains('inactive')) {
    if (event.code == 'Space') {
      renderNewSentence();
      document.getElementById('startHeading').innerText = 'Press ESC to quit';
      overlayElement.classList.toggle('inactive');
      timer = setInterval(() => {
        let endTime = new Date();
        timeElapsed = (endTime - startTime) / 1000;
        timeDisplayElement.innerText = Math.floor(timeElapsed);
      }, 1000);
    }
  } else {
    incorDisplayElement.innerText = incorrect;

    if (event.key == 'Escape') {
      document.getElementById('startHeading').innerText = 'Press space to start';
      wordsDisplayElement.innerHTML = null;
      overlayElement.classList.toggle('inactive');
      clearInterval(timer);
      index = 0;
      timeDisplayElement.innerText = 0;
    }

    if (!notChars.includes(event.key)) {
      if (letterSpan[index].getAttribute('name') == event.key) {
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
      console.log(`Old score is ${score}`);
      score = score ? Math.floor((score + (wpm * 50 - incorrect * 30)) / 2) : (wpm * 50 - incorrect * 30);
      console.log(`New score is ${wpm * 50 - incorrect * 30}`);
      console.log(`Combinded score is ${score}`);
      scoreElement.innerText = score;
      wpmDisplayElement.innerText = wpm;
      cpmDisplayElement.innerText = cpm;

      renderNewSentence();
      incorrect = 0;
    }
  }
});

const renderNewSentence = () => {
  startTime = new Date();
  charCount = 0;
  let sentence = words(wordCount).join(' ').split('');
  console.log(sentence);

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
}