// halting
// stopping
// interruptsDisabled

var hz = 4190000;
var sc = 1/hz;

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

function cpuCycle() {
    if(emCycl == 0) {
        // Emulated cpu cycle here
        
        emCycl = tmpCycl;
    }
    else emCycl --;
}