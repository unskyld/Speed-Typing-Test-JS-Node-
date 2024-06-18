
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//mode selection
console.log('\x1b[36m%s\x1b[0m', "This is a speed typing test that measures accuracy and speed of typing. Please select mode.");
let modeOneMin = false , modeText = false;
function promptModeSelection(){
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
promptModeSelection();

//implementing time measurement
let time = 60000;
let interval;
function timeCount(){ 
    time -= 1000;
    process.stdout.write(`\x1b[36m\x1b[0m, \rTime remaining: ${time/1000} seconds. `);
    if(time=== 0){
        clearInterval(interval);
        console.log('\x1b[36m%s\x1b[0m',"Time's up! Your result:");
    }
}
function intervalForCounter(timeCount){
    interval = setInterval(timeCount,1000);
}
//implementing one-minute mode
/*if(modeOneMin == true){ 
 startTesting();
}*/

let wordlist= ["reptile","norm","silver", ]
//function to shuffle array
function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  
//function to display words, set off the timer 
function startTesting(){
    shuffle(wordlist);
    //displaying the first word and waiting for user to start typing
    process.stdout.write(wordlist[0]);
    console.log('\x1b[36m%s\x1b[0m', ' The clock starts with the first key press. Good luck.');
    for(i = 0; i<(wordlist.length); i++){
        process.stdout.write(`\r${wordlist[i]} `);
    
    }
    if(!interval){
    rl.input.on('keypress', (str, key) => {
        intervalForCounter()});
}
}


//red console.log(`\x1b[38;5;196m${}\x1b[0m`);
//green console.log(`\x1b[32m${}\x1b[0m`);