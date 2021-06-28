// halting
// stopping
// interruptsDisabled

var hz = 4190000; // GameBoy Frequency
var sc = 1/hz; // Seconds
var rom_loaded = false;

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

var clscnt = 0;
function debugPrint(){
    if(clscnt == 1000) {
        console.log("PC=0x"+reg[PC].toString(16)+" MemContains:"+readMem(reg[PC]).toString(16));
        console.log("AF=0x"+reg[AF].toString(16)+" MemContains:"+readMem(reg[AF]).toString(16));
        console.log("BC=0x"+reg[BC].toString(16)+" MemContains:"+readMem(reg[BC]).toString(16));
        console.log("DE=0x"+reg[DE].toString(16)+" MemContains:"+readMem(reg[DE]).toString(16));
        console.log("HL=0x"+reg[HL].toString(16)+" MemContains:"+readMem(reg[HL]).toString(16));
        console.log("SP=0x"+reg[SP].toString(16)+" MemContains:"+readMem(reg[SP]).toString(16));
        console.log("=================");
        clscnt = 0;
    }
    clscnt ++;
}

function cpuCycle() {
    let stp = 0;
    if(emCycl == 0) {
        // Emulated cpu cycle here
        if(cyclesToWait <= 0){
            cyclesToWait = decode[readMem(reg[PC])]();
            cyclesToWait += ScreenCycle(cyclesToWait);
            debugPrint();
            stp = 1;
        }
        else cyclesToWait--;

        emCycl = tmpCycl;
    }
    else emCycl --;
    return stp;
}
