const readline = require('readline');
const path = require('path');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});


// Mode selection
let modeOneMin = false, modeText = false;
 const promptModeSelection = () => {
  console.log('\x1b[36m%s\x1b[0m', "This is a speed typing test that measures accuracy and speed of typing. Please select mode.");
 rl.question('\x1b[36m%s\x1b[0m', 'Which mode do you prefer? One minute mode or text writing mode? Enter: "One minute" or "Text" to select.', (mode) => {

     if(mode.toLowerCase() === "one minute"){ 
     console.log('\x1b[36m%s\x1b[0m','Selected One Minute Mode');
     modeOneMin = true;
     modeText = false;
     rl.close();
     startTesting();


 }   else if(mode.toLowerCase() === "text"){ 
     console.log('\x1b[36m%s\x1b[0m','Selected Text Writing mode.');
     modeText = true;
     modeOneMin = false;
     rl.close();
     startTesting();
 }
    else if(modeOneMin == false || modeText == false){ 
        console.log('\x1b[36m%s\x1b[0m',"Please select an existing mode");
        promptModeSelection();
    }

 })
 }
 //promptModeSelection();

 let time = 60000;
 let interval = false;
 let wordlist 
 let currentPointer = 0;
 let word = "";
 let wordIndex = 0;
 let incorrectCounter = 0;
 let allCorrectCounter = 0;
 let allIncorrectCounter = 0;
 let allTypedCharactersCounter = 0;
 let rageWrongInputFlag = false;
 let mistakesCorrectedInWord = 0;

// Save the directory of the script into filePath variable
const filePath = path.join(__dirname, 'words.json');

// Check if the file exists in the file path
fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('File does not exist:', filePath);
    return;
  }

  // Attempt to parse JSON
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }
    try {
      wordlist = JSON.parse(data);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return;
    }

    // Start the typing test only after wordlist parsed
    startTesting();
  });
});

// Function to shuffle an array
function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

// Function to handle the timer countdown
function timeCount() {
  time -= 1000;
  process.stdout.write("\x1b7");
  readline.cursorTo(process.stdout, 0, 0); // Move cursor to the start of the timer line
  readline.clearLine(process.stdout, 0); // Clear the line
  process.stdout.write(`Time remaining: ${time / 1000} seconds.\t`);
  process.stdout.write("\x1b8");
  if (time <= 0) {
    clearInterval(interval);
    console.log(`\x1b[36m\nTime's up! Your result: ${result()}\x1b[0m`);
    rl.close();
  }
}

// Function to start the interval timer
function intervalForCounter() {
  interval = setInterval(timeCount, 1000);
}

// Function to handle whitespace input
function caseWhitespace() {
  if (currentPointer > 0) {
    if( !rageWrongInputFlag){
      allIncorrectCounter +=  word.length - currentPointer - incorrectCounter; // Adjusting allIncorrectCounter to count only the untyped characters
    }
  
  
    currentPointer = 0;
    rageWrongInputFlag = false;
    incorrectCounter=0;
    wordIndex++;
    allIncorrectCounter -= mistakesCorrectedInWord;
    mistakesCorrectedInWord = 0;
    if (wordIndex < wordlist.length) {
      word = wordlist[wordIndex];
      console.log(`\n\x1b[33m${word}\x1b[0m`);
      
    }
  }
}

// Function to handle backspace input
function caseBackspace() {
  if (currentPointer > 0 || incorrectCounter > 0) {  // Check if there are characters to delete
    if (incorrectCounter > 0) {
      incorrectCounter--;
      if( mistakesCorrectedInWord <= word.length && mistakesCorrectedInWord <= allIncorrectCounter){ 
        if(!incorrectCounter + currentPointer < word.length)
        mistakesCorrectedInWord++;  //TODO: Fix allIncorrect logic
      }
    } else {
      currentPointer--;
      allCorrectCounter--;
    }
  }

  // Ensuring currentPointer does not go below zero
  if (currentPointer < 0) {
    currentPointer = 0;
  }
}


// Function to handle correct character input
function caseCorrectCharacter(inputCharacter) {
  
  if(incorrectCounter === 0){
  process.stdout.write('\x1b[D'); // Move the cursor to the left
  process.stdout.write('\x1b[1X'); // Delete character
  process.stdout.write(`\x1b[32m${inputCharacter}\x1b[0m`); // Print the character in green
  allCorrectCounter++;
  allTypedCharactersCounter++;
  currentPointer++;
  
  
  if (currentPointer >= word.length) { // Move to the next word
    currentPointer = 0;
    wordIndex++;
    incorrectCounter = 0;
    allIncorrectCounter -= mistakesCorrectedInWord;
    mistakesCorrectedInWord = 0;
    if (wordIndex < wordlist.length) {
      word = wordlist[wordIndex];
      console.log(`\n\x1b[33m${word}\x1b[0m`);
    }
  }
}
}

// Function to handle incorrect character input
function caseIncorrectCharacter(inputCharacter) {
  incorrectCounter++;
  if (incorrectCounter <= word.length - currentPointer ) { // Adjusting allIncorrectCounter for better accuracy in case the user ragequits
    allIncorrectCounter++;
    allTypedCharactersCounter++;
  }
  else if (incorrectCounter <= word.length - currentPointer){ // Set a flag so as not to increment after whitespace
    rageWrongInputFlag = true;
  }
  process.stdout.write('\x1b[D'); 
  process.stdout.write('\x1b[1X'); 
  process.stdout.write(`\x1b[38;5;196m${inputCharacter}\x1b[0m`);
}

// Main function to check the spelling of typed characters
function spellingCheck(inputCharacter) {
  inputCharacter = inputCharacter.toLowerCase();
  if (inputCharacter === ' ' || inputCharacter === '\n' || inputCharacter === '\t' || inputCharacter === '\r') {
    caseWhitespace();
  } 
  else if (inputCharacter.charCodeAt(0) === 8 || inputCharacter.charCodeAt(0) === 127 ) { // Backspace character code //fix
    caseBackspace();
  } 
  else {
    if (word[currentPointer] !== inputCharacter || incorrectCounter > 0) {
      caseIncorrectCharacter(inputCharacter);
    } 
    else {
      caseCorrectCharacter(inputCharacter);
    }
  }
}

// Function to handle the first key press to start the timer
function startTesting() {
  shuffle(wordlist);
  word = wordlist[0];
  console.log(
      "\x1b[36m%s\x1b[0m",
      "This is a speed typing test that measures accuracy and speed of typing."
  );
  console.log("\x1b[33m%s\x1b[0m", word);
  console.log(
      "\n\x1b[36m%s\x1b[0m",
      "The timer starts with the first key press. Good luck."
  );
  
  process.stdin.setRawMode(true);
  process.stdin.resume();

  process.stdin.once("data", (data) => {
  process.stdout.write("\x1b[2K"); 
  process.stdout.write("\x1b[1A");
  process.stdout.write("\x1b[2K");

      process.stdin.setRawMode(false);
      process.stdin.pause();

      intervalForCounter();
      spellingCheck(data.toString());

      process.stdin.setRawMode(true);
      process.stdin.resume();

      process.stdin.on("data", (data) => {
          const inputChar = data.toString();
          spellingCheck(inputChar);
      });
  });

  process.stdin.on("close", () => {
      console.error("Input stream closed.");
  });
}

function result() {
  let accuracy = ((allCorrectCounter / allTypedCharactersCounter) * 100).toFixed(2);
  let grossWPM = (allTypedCharactersCounter / 5);
  let netWPM = (grossWPM - (allIncorrectCounter / 5)).toFixed(2);
  return `\n\x1b[1;32mAccuracy: ${accuracy}%\nGross WPM: ${grossWPM.toFixed(2)}\nNet WPM: ${netWPM}\x1b[0m\n`;
}
