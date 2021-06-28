
var processorInterval;

function loadSet(jsonObj){
    var reader = new FileReader();

    reader.addEventListener("load", function(event) {
        var buff = new Uint8Array(event.target.result);
        for(var i = 0; i < buff.byteLength; i++){
            rom_bank[i] = buff[i];
        }
    });
    console.log(jsonObj)
    var f = reader.readAsArrayBuffer(jsonObj);
}

document.getElementById("file-input").addEventListener("change",function(evt){
    loadSet(evt.target.files[0]);
});


function TurnOnGameboy() {
    resetSoundRegisters();
    STAT = 1;
    SCX = 0;
    processorInterval = setInterval(() =>  {
        let times = 1000000;
        while(true){
            times -= cpuCycle();
            if(times == 0) break;
        }
    }, 10);
}

function TurnOffGameboy() {
    clearInterval(processorInterval);
    reg[AF] = 0;
    reg[BC] = 0;
    reg[DE] = 0;
    reg[HL] = 0;
    reg[SP] = 0;
    reg[PC] = 0;
    for(var i = 0; i < 0xFFFF; i++) writeMem(i, 0);
}