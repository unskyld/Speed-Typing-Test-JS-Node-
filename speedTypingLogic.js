
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//mode selection
console.log("This is a speed typing test thqat measures accuracy and speed of typing. Please select mode.");
let modeOneMin, modeText;
function promptModeSelection(){
rl.question('Which mode do you prefer? One minute mode or text writing mode? Enter: "One minute" or "Text" to select.', (mode) => {
    
    if(mode.toLowerCase() === "one minute"){ 
    console.log('Selected One Minute Mode');
    modeOneMin = true;
    modeText = false;
    rl.close();

}   else if(mode.toLowerCase() === "text"){ 
    console.log('Selected Text Writing mode.');
    modeText = true;
    modeOneMin = false;
    rl.close();
}
    else if(modeOneMin == false || modeText == false){ 
        console.log("Please select an existing mode");
        promptModeSelection();
    }

})
}
promptModeSelection();
let time = 60000;
function counter(){ 
    time -= 1000;
    process.stdout.write(`Time remaining: ${time/1000} seconds. \r`);
    if(time=== 0){
        clearInterval()
        console.log("Time's up! Your result:")
    }
}
function intervalForCounter(counter){
    setInterval(counter,1000);
}
if(modeOneMin == true){ 

}

if(modeText == true){ 
}
function modeTextFunction(){
    const start = performance.now();
    const end = performance.now();
    
    const elapsed = end - start;
    console.log(`Task took ${elapsed} milliseconds`);
}

let wordlist= ["reptile","norm","silver", ]
console.log("\x1b[38;5;196mHello\x1b[0m");