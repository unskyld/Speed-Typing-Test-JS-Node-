
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});


//mode selection
console.log('\x1b[36m%s\x1b[0m', "This is a speed typing test that measures accuracy and speed of typing. Please select mode.");
let modeOneMin = false, modeText = false;
// const promptModeSelection = () => {
// rl.question('\x1b[36m%s\x1b[0m', 'Which mode do you prefer? One minute mode or text writing mode? Enter: "One minute" or "Text" to select.', (mode) => {

//     if(mode.toLowerCase() === "one minute"){ 
//     console.log('\x1b[36m%s\x1b[0m','Selected One Minute Mode');
//     modeOneMin = true;
//     modeText = false;
//     rl.close();
//     startTesting();


// }   else if(mode.toLowerCase() === "text"){ 
//     console.log('\x1b[36m%s\x1b[0m','Selected Text Writing mode.');
//     modeText = true;
//     modeOneMin = false;
//     rl.close();
//     startTesting();
// }
//     else if(modeOneMin == false || modeText == false){ 
//         console.log('\x1b[36m%s\x1b[0m',"Please select an existing mode");
//         promptModeSelection();
//     }

// })
// }
// promptModeSelection();

//implementing time measurement

let time = 60000;
let interval = false;
let wordlist = [
  "reptile",
  "norm",
  "silver",
  "monkey",
  "rubber",
  "powerless",
  "beets",
  "unification",
  "zealous",
];
let currentPointer = 0;
let word = "";
let wordIndex = 0;

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
    console.log("\nTime's up! Your result:");
    rl.close();
  }
}

// Function to start the interval timer
function intervalForCounter() {
  interval = setInterval(timeCount, 1000);
}

// Function to check the spelling of typed characters
function spellingCheck(inputCharacter) {
    //handle whitespace
    if (inputCharacter === ' ') {
        if (currentPointer > 0) {
            currentPointer = 0;
            wordIndex++;
            if (wordIndex < wordlist.length) {
                word = wordlist[wordIndex];
                console.log(`\n\x1b[33m${word}\x1b[0m`);
            }
        }
        //handle backspace
    } if (inputCharacter === '\u0008'){
        if(inputCharacter!==word[currentPointer]){
            
            //TODO: IMPLEMENT BACKSPACE LOGIC 
            
        
        }
       
    
    } else {
        //letter is not the same as input
        if (word[currentPointer] !== inputCharacter) {
            if (currentPointer === 0){  //moving the cursor to the left, deleting character and printing a red-colored letter 
                process.stdout.write('\x1b[D'); 
                process.stdout.write('\x1b[1X');      
                process.stdout.write(`\x1b[38;5;196m${inputCharacter}\x1b[0m`);
            }
            else{
                process.stdout.write('\x1b[D'); 
                process.stdout.write('\x1b[1X');      
                process.stdout.write(`\x1b[38;5;196m${inputCharacter}\x1b[0m`);
                
            }
        } else {
            //letter is the same as input
            
            if (currentPointer === 0){
                process.stdout.write('\x1b[D'); //moving the cursor to the left, deleting character and printing a green-colored letter 
                process.stdout.write('\x1b[1X');      
                process.stdout.write(`\x1b[32m${inputCharacter}\x1b[0m`);
            }
            else{
                process.stdout.write('\x1b[D'); 
                process.stdout.write('\x1b[1X');     
                process.stdout.write(`\x1b[32m${inputCharacter}\x1b[0m`);
                
            }
            currentPointer++;
            if (currentPointer >= word.length) {
                currentPointer = 0;
                wordIndex++;
                if (wordIndex < wordlist.length) {
                    word = wordlist[wordIndex];
                    console.log(`\n \x1b[33m${word}\x1b[0m`);
                } 
            }
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

  // Delete the message line after one second
  setTimeout(() => {
    process.stdout.write("\x1b[1A");
    process.stdout.write("\x1b[2K");
  }, 1000);

  process.stdin.setRawMode(true);
  process.stdin.resume();

  process.stdin.once("data", (data) => {
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

// Start the typing test
startTesting();
