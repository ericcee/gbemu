// halting
// stopping
// interruptsDisabled

var hz = 4190000; // GameBoy Frequenzy
var sc = 1/hz; // Seconds

function getEmulatedCyclefreqDiff(){
    var emulatedSeconds = 0;
    var dt = Date.now();
    var chkCycl = 500;
    var clock = 0;
    
    while(true){
        clock+=sc;
        if(clock >= 1) {
            emulatedSeconds++;
            clock = 0;
        }
        
        if(chkCycl == 0 && Date.now() - dt >= 1000) break;
        chkCycl = chkCycl==0?500:chkCycl - 1;
    }
    return emulatedSeconds;
}

var emCycl = getEmulatedCyclefreqDiff();
var tmpCycl = emCycl;
var cyclesToWait = 0;

function cpuCycle() {
    if(emCycl == 0) {
        // Emulated cpu cycle here
        if(cyclesToWait <= 0){
            cyclesToWait = decode[readMem(reg[PC])]();
        }
        else cyclesToWait--;
        
        emCycl = tmpCycl;
    }
    else emCycl --;
}