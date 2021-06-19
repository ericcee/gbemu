function debugPrint(){
    console.log("PC=0x"+reg[PC].toString(16)+" MemContains:"+readMem(reg[PC]).toString(16));
    console.log("AF=0x"+reg[AF].toString(16)+" MemContains:"+readMem(reg[AF]).toString(16));
    console.log("BC=0x"+reg[BC].toString(16)+" MemContains:"+readMem(reg[BC]).toString(16));
    console.log("DE=0x"+reg[DE].toString(16)+" MemContains:"+readMem(reg[DE]).toString(16));
    console.log("HL=0x"+reg[HL].toString(16)+" MemContains:"+readMem(reg[HL]).toString(16));
    console.log("SP=0x"+reg[SP].toString(16)+" MemContains:"+readMem(reg[SP]).toString(16));
    console.log("=================");
}

reg[PC] = 0;

var xi = setInterval(function(){
    decode[readMem(reg[PC])]();
    debugPrint();
    //console.log(getByteRegister(A))
    //console.log(getByteRegister(B))
    if(reg[PC] == 0x100) clearInterval(xi);
}, 1);