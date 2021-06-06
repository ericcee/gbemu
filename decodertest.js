function debugPrint(){
    console.log("PC="+reg[PC].toString(16));
    console.log("AF="+reg[AF].toString(16));
    console.log("BC="+reg[BC].toString(16));
    console.log("DE="+reg[DE].toString(16));
    console.log("HL="+reg[HL].toString(16));
    console.log("SP="+reg[SP].toString(16));
}


memory[0x100]=0x08;
memory[0x101]=0x23;
memory[0x102]=0x12;
memory[0x103]=0x01;
memory[0x104]=0x23;
memory[0x105]=0x12;
memory[0x106]=0x3E;
memory[0x107]=0x69;
memory[0x108]=0x4C;
memory[0x109]=0x02;
memory[0x10a]=0x1E;
memory[0x10b]=0x05;
memory[0x10c]=0x16;
memory[0x10d]=0x64;
memory[0x10e]=0x2e;
memory[0x10f]=0x64;
memory[0x110]=0x26;
memory[0x111]=0x64;
memory[0x112]=0xE5;
memory[0x113]=0xF1;

decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();
decode[readMem(reg[PC])]();

debugPrint();