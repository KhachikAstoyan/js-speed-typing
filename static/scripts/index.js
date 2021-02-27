import words from './word-generator.js'

const wordsDisplayElement = document.getElementById('words');
const timeDisplayElement = document.getElementById('timeElapsed');
const wpmDisplayElement = document.getElementById('wpm');
const cpmDisplayElement = document.getElementById('cpm');
const incorDisplayElement = document.getElementById('incor');
const incorRatioDisplayElement = document.getElementById('incorRatio');
let letterSpan = wordsDisplayElement.querySelectorAll('span');

let index = 0;
let notChars = ['Shift', 'Control', 'Meta', 'CapsLock', 'Tab',
  'Escape', 'AudioVolumeUp', 'AudioVolumeUp',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  'Insert', 'Delete', 'Backspace', 'Enter', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'
];
let charCount = 0;
let wordCount = 25;
let incorrect = 0;
let timeElapsed;
let startTime = new Date();

document.addEventListener('keydown', event => {

  if (!notChars.includes(event.key)) {
    if (letterSpan[index].getAttribute('name') == event.key) {
      letterSpan[index].classList.add('correct');
      letterSpan[index].classList.remove('incorrect-temp');
      letterSpan[index].classList.remove('focused');
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
    let endTime = new Date();
    timeElapsed = (endTime - startTime) / 1000;
    let wpm = Math.round((60 * wordCount / timeElapsed));
    let cpm = Math.round((60 * charCount / timeElapsed));
    timeDisplayElement.innerText = timeElapsed;
    wpmDisplayElement.innerText = wpm;
    cpmDisplayElement.innerText = cpm;
    incorDisplayElement.innerText = incorrect;
    incorRatioDisplayElement.innerText = `${Math.round(((incorrect / charCount) * 100))}%`;
    console.log(`Number of incorrect letters - ${incorrect}`);
    console.log(`Number of characters: ${charCount}`);
    console.log(`Elapsed time: ${timeElapsed} seconds`);
    console.log(`WPM: ${wpm}`);
    console.log(`Cpm: ${cpm}`);
    renderNewSentence();
    incorrect = 0;
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
      if (letter == ' ') {
        letterElement.innerText = '_';
        letterElement.setAttribute('name', ' ');
      } else {
        letterElement.innerText = letter;
        letterElement.setAttribute('name', letter);
      }

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


renderNewSentence();