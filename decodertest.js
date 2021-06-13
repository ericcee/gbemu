function debugPrint(){
    console.log("PC="+reg[PC].toString(16));
    console.log("AF="+reg[AF].toString(16));
    console.log("BC="+reg[BC].toString(16));
    console.log("DE="+reg[DE].toString(16));
    console.log("HL="+reg[HL].toString(16));
    console.log("SP="+reg[SP].toString(16));
}

memory[0x100]=0x3E
memory[0x101]=0xF0

memory[0x102]=0xCB
memory[0x103]=0x07

memory[0x104]=0xCB
memory[0x105]=0x37

memory[0x106]=0xC3
memory[0x107]=0x06
memory[0x108]=0x01


var xi = setInterval(function(){
    if(readMem(reg[PC])==0) clearInterval(xi);
    decode[readMem(reg[PC])]();
    debugPrint();
    console.log(getByteRegister(A))
    console.log(getByteRegister(B))
}, 500);