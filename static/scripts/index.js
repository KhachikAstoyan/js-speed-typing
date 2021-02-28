import words from './word-generator.js'

const wordsDisplayElement = document.getElementById('words');
const timeDisplayElement = document.getElementById('timeElapsed');
const wpmDisplayElement = document.getElementById('wpm');
const cpmDisplayElement = document.getElementById('cpm');
const incorDisplayElement = document.getElementById('incor');
const incorRatioDisplayElement = document.getElementById('incorRatio');
const overlayElement = document.querySelector('.overlay');
let letterSpan = wordsDisplayElement.querySelectorAll('span');
let index = 0;
let notChars = ['Shift', 'Control', 'Meta', 'CapsLock', 'Tab',
  'Escape', 'AudioVolumeUp', 'AudioVolumeUp',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  'Insert', 'Delete', 'Backspace', 'Enter', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'
];
let charCount = 0;
let wordCount = 20;
let incorrect = 0;
let timeElapsed;
let startTime = new Date();
let wpm = 0;
let cpm = 0;

document.addEventListener('keydown', event => {
  console.log(event);

  if (overlayElement.classList.contains('inactive')) {
    if (event.code == 'Space') {
      renderNewSentence();
      document.getElementById('startHeading').remove();
      overlayElement.classList.toggle('inactive');
      setInterval(() => {
        let endTime = new Date();
        timeElapsed = (endTime - startTime) / 1000;
        timeDisplayElement.innerText = Math.floor(timeElapsed);
      }, 1000);
    }
  } else {
    incorDisplayElement.innerText = incorrect;
    incorRatioDisplayElement.innerText = `${Math.round(((incorrect / charCount) * 100))}%`;

    if (!notChars.includes(event.key)) {
      if (letterSpan[index].getAttribute('name') == event.key) {
        letterSpan[index].remove();
        // letterSpan[index].classList.add('correct');
        // letterSpan[index].classList.remove('incorrect-temp');
        // letterSpan[index].classList.remove('focused');
        index++;
        if (index < letterSpan.length) {
          letterSpan[index].classList.add('focused');
        }
      } else {
        letterSpan[index].classList.add('incorrect');
        letterSpan[index].classList.add('incorrect-temp');
        incorrect++;
      }
    }

    if (index == letterSpan.length) {
      index = 0;
      wordsDisplayElement.innerHTML = 'Loading...';

      wpm = Math.round((60 * wordCount / timeElapsed));
      cpm = Math.round((60 * charCount / timeElapsed));
      wpmDisplayElement.innerText = wpm;
      cpmDisplayElement.innerText = cpm;

      console.log(`Number of incorrect letters - ${incorrect}`);
      console.log(`Number of characters: ${charCount}`);
      console.log(`Elapsed time: ${timeElapsed} seconds`);
      console.log(`WPM: ${wpm}`);
      console.log(`Cpm: ${cpm}`);

      renderNewSentence();
      incorrect = 0;
    }
  }
});

const renderNewSentence = () => {
  startTime = new Date();
  charCount = 0;
  let sentence = words(wordCount);
  wordsDisplayElement.innerText = null;
  console.log(sentence);

  sentence.forEach(word => {
    let wordElement = document.createElement('p');
    wordElement.classList.add('word');

    word.split('').forEach(letter => {
      charCount++;
      let letterElement = document.createElement('span');
      letterElement.innerText = letter;
      letterElement.setAttribute('name', letter);
      wordElement.appendChild(letterElement);
    });

    if (sentence.indexOf(word) !== sentence.length - 1) {
      let spaceElement = document.createElement('span');
      spaceElement.innerText = '_';
      spaceElement.setAttribute('name', ' ');
      wordElement.appendChild(spaceElement);
    }

    wordsDisplayElement.appendChild(wordElement);
  });

  letterSpan = wordsDisplayElement.querySelectorAll('span');
  letterSpan[index].classList.add('focused');
}