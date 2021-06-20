var memory = new Uint8Array(0xFFFF);

memory.forEach((v,i)=>{
    memory[i] = 0;
});

function readMem(i){
    return memory[i];
}

function writeMem(i,b){
    memory[i] = b;
}

function reset(){
    reg[AF]=0;
    reg[BC]=0;
    reg[HL]=0;
    reg[DE]=0;
    reg[PC]=0;
}


function op0(){
    reset();
	writeMem(0, 0x0);
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==1, cpul == 4];
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}

function op1(){ // LD BC,d16
    reset();
	writeMem(0, 0x1);
    writeMem(1, 0x34);
    writeMem(2, 0x12);
    
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==3, cpul == 12, reg[BC]==0x1234];
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}

function op2(){ // LD (BC),A
    reset();
	writeMem(0, 0x2);
    setByteRegister(A, 127);
    reg[BC] = 0x1234;
    
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==1, cpul == 8, readMem(0x1234) == 127];
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}

function op3(){ // INC BC
    reset();
	writeMem(0, 0x3);
    var z = getFlag(_Z);
    var h = getFlag(_H);
    var n = getFlag(_N);
    var c = getFlag(_C);
    
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==1, cpul == 8, reg[BC] == 1];
    passes.push(getFlag(_Z) == z);
    passes.push(getFlag(_H) == h);
    passes.push(getFlag(_N) == n);
    passes.push(getFlag(_C) == c);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}

function op4(){ // INC B
    reset();
	writeMem(0, 0x4);
    var oldCarry = getFlag(_C);
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==1, cpul == 4, getByteRegister(B) == 1, getFlag(_Z) == 0, getFlag(_N) == 0, getFlag(_H) == 0, oldCarry == getFlag(_C)];
    reg[PC] = 0;
    
    setByteRegister(B, 0x0F);
    cpul = decode[readMem(0)]();
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_C) == oldCarry);
    reg[PC] = 0;
    
    setByteRegister(B, 0xFF);
    cpul = decode[readMem(0)]();
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_C) == oldCarry);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}

function op5(){ // needs checking DEC B
    reset();
	writeMem(0, 0x5);
    setByteRegister(B, 1);
    var c = getFlag(_C);
	var cpul = decode[readMem(0)]();
    var passes = [];
    passes.push(reg[PC] == 1);
    passes.push(cpul == 4);
    passes.push(getFlag(_N) == 1);
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_H) == 0);
    passes.push(getByteRegister(B) == 0);
    reset();
    setByteRegister(B, 0xFF);
    var cpul = decode[readMem(0)]();
    passes.push(getFlag(_N) == 1);
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_H) == 0);
    passes.push(getByteRegister(B) == 0xFE);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op6(){ // LD B,d8
    reset();
	writeMem(0, 0x6);
    writeMem(1, 123);
    
    var z = getFlag(_Z);
    var h = getFlag(_H);
    var n = getFlag(_N);
    var c = getFlag(_C);
    
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(getFlag(_Z) == z);
    passes.push(getFlag(_H) == h);
    passes.push(getFlag(_N) == n);
    passes.push(getFlag(_C) == c);
    passes.push(getByteRegister(B) == 123);
    passes.push(reg[PC] == 2);
    passes.push(cpul == 8);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op7(){ // RCLA
    reset();
    setByteRegister(A, 0b01000000);
	writeMem(0, 0x7);
    var h = getFlag(_H);
    var n = getFlag(_N);
    
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_H) == h);
    passes.push(getFlag(_N) == n);
    passes.push(getFlag(_C) == 0);
    passes.push(getByteRegister(A) == 0b10000000);
    passes.push(cpul == 4);
    passes.push(reg[PC] == 1);
    
    reset();
    
    setByteRegister(A, 0b10000000);
    decode[readMem(0)]();
    passes.push(getFlag(_C) == 1);
    passes.push(getByteRegister(A) == 0b00000001);
    reset();
    
    setByteRegister(A, 0b00000001);
    decode[readMem(0)]();
    passes.push(getFlag(_C) == 0);
    passes.push(getByteRegister(A) == 0b00000010);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op8(){ // LD (a16),SP
    reset();
    reg[SP] = 0xFAFE;
	writeMem(0, 0x8);
    writeMem(1, 0x34);
    writeMem(2, 0x12);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(reg[PC] == 3);
    passes.push(cpul == 20);
    passes.push(readMem(0x1234) == 0xFE);
    passes.push(readMem(0x1235) == 0xFA);
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op9(){  // ADD HL,BC
    reset();
	writeMem(0, 0x9);
    reg[HL] = 0xFF00;
    reg[BC] = 0xFF;
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(cpul == 8);
    passes.push(reg[PC] == 1);
    passes.push(reg[HL] == 0xFFFF);
    passes.push(getFlag(_C) == 0);
    reset();
    reg[HL] = 0xFFFF;
    reg[BC] = 0x01;
	decode[readMem(0)]();
    passes.push(reg[HL] == 0);
    passes.push(getFlag(_C) == 1);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function opA(){ // LD A,(BC)
    reset();
	writeMem(0, 0xA);
    writeMem(reg[BC], 123);
    
	var cpul = decode[readMem(0)]();
    console.log(cpul);
    var passes = [];
    passes.push(reg[PC] == 1);
    passes.push(cpul == 8);
    passes.push(getByteRegister(A) == 123);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function opB(){
	writeMem(0, 0xB);
	decode[readMem(0)]();
}
function opC(){
	writeMem(0, 0xC);
	decode[readMem(0)]();
}
function opD(){
	writeMem(0, 0xD);
	decode[readMem(0)]();
}
function opE(){
	writeMem(0, 0xE);
	decode[readMem(0)]();
}
function opF(){
	writeMem(0, 0xF);
	decode[readMem(0)]();
}
function op10(){
	writeMem(0, 0x10);
	decode[readMem(0)]();
}
function op11(){
	writeMem(0, 0x11);
	decode[readMem(0)]();
}
function op12(){
	writeMem(0, 0x12);
	decode[readMem(0)]();
}
function op13(){
	writeMem(0, 0x13);
	decode[readMem(0)]();
}
function op14(){
	writeMem(0, 0x14);
	decode[readMem(0)]();
}
function op15(){
	writeMem(0, 0x15);
	decode[readMem(0)]();
}
function op16(){
	writeMem(0, 0x16);
	decode[readMem(0)]();
}
function op17(){
	writeMem(0, 0x17);
	decode[readMem(0)]();
}
function op18(){
	writeMem(0, 0x18);
	decode[readMem(0)]();
}
function op19(){
	writeMem(0, 0x19);
	decode[readMem(0)]();
}
function op1A(){
	writeMem(0, 0x1A);
	decode[readMem(0)]();
}
function op1B(){
	writeMem(0, 0x1B);
	decode[readMem(0)]();
}
function op1C(){
	writeMem(0, 0x1C);
	decode[readMem(0)]();
}
function op1D(){
	writeMem(0, 0x1D);
	decode[readMem(0)]();
}
function op1E(){
	writeMem(0, 0x1E);
	decode[readMem(0)]();
}
function op1F(){
	writeMem(0, 0x1F);
	decode[readMem(0)]();
}
function op20(){
	writeMem(0, 0x20);
	decode[readMem(0)]();
}
function op21(){
	writeMem(0, 0x21);
	decode[readMem(0)]();
}
function op22(){
	writeMem(0, 0x22);
	decode[readMem(0)]();
}
function op23(){
	writeMem(0, 0x23);
	decode[readMem(0)]();
}
function op24(){
	writeMem(0, 0x24);
	decode[readMem(0)]();
}
function op25(){
	writeMem(0, 0x25);
	decode[readMem(0)]();
}
function op26(){
	writeMem(0, 0x26);
	decode[readMem(0)]();
}
function op27(){
	writeMem(0, 0x27);
	decode[readMem(0)]();
}
function op28(){
	writeMem(0, 0x28);
	decode[readMem(0)]();
}
function op29(){
	writeMem(0, 0x29);
	decode[readMem(0)]();
}
function op2A(){
	writeMem(0, 0x2A);
	decode[readMem(0)]();
}
function op2B(){
	writeMem(0, 0x2B);
	decode[readMem(0)]();
}
function op2C(){
	writeMem(0, 0x2C);
	decode[readMem(0)]();
}
function op2D(){
	writeMem(0, 0x2D);
	decode[readMem(0)]();
}
function op2E(){
	writeMem(0, 0x2E);
	decode[readMem(0)]();
}
function op2F(){
	writeMem(0, 0x2F);
	decode[readMem(0)]();
}
function op30(){
	writeMem(0, 0x30);
	decode[readMem(0)]();
}
function op31(){
	writeMem(0, 0x31);
	decode[readMem(0)]();
}
function op32(){
	writeMem(0, 0x32);
	decode[readMem(0)]();
}
function op33(){
	writeMem(0, 0x33);
	decode[readMem(0)]();
}
function op34(){
	writeMem(0, 0x34);
	decode[readMem(0)]();
}
function op35(){
	writeMem(0, 0x35);
	decode[readMem(0)]();
}
function op36(){
	writeMem(0, 0x36);
	decode[readMem(0)]();
}
function op37(){
	writeMem(0, 0x37);
	decode[readMem(0)]();
}
function op38(){
	writeMem(0, 0x38);
	decode[readMem(0)]();
}
function op39(){
	writeMem(0, 0x39);
	decode[readMem(0)]();
}
function op3A(){
	writeMem(0, 0x3A);
	decode[readMem(0)]();
}
function op3B(){
	writeMem(0, 0x3B);
	decode[readMem(0)]();
}
function op3C(){
	writeMem(0, 0x3C);
	decode[readMem(0)]();
}
function op3D(){
	writeMem(0, 0x3D);
	decode[readMem(0)]();
}
function op3E(){
	writeMem(0, 0x3E);
	decode[readMem(0)]();
}
function op3F(){
	writeMem(0, 0x3F);
	decode[readMem(0)]();
}
function op40(){
	writeMem(0, 0x40);
	decode[readMem(0)]();
}
function op41(){
	writeMem(0, 0x41);
	decode[readMem(0)]();
}
function op42(){
	writeMem(0, 0x42);
	decode[readMem(0)]();
}
function op43(){
	writeMem(0, 0x43);
	decode[readMem(0)]();
}
function op44(){
	writeMem(0, 0x44);
	decode[readMem(0)]();
}
function op45(){
	writeMem(0, 0x45);
	decode[readMem(0)]();
}
function op46(){
	writeMem(0, 0x46);
	decode[readMem(0)]();
}
function op47(){
	writeMem(0, 0x47);
	decode[readMem(0)]();
}
function op48(){
	writeMem(0, 0x48);
	decode[readMem(0)]();
}
function op49(){
	writeMem(0, 0x49);
	decode[readMem(0)]();
}
function op4A(){
	writeMem(0, 0x4A);
	decode[readMem(0)]();
}
function op4B(){
	writeMem(0, 0x4B);
	decode[readMem(0)]();
}
function op4C(){
	writeMem(0, 0x4C);
	decode[readMem(0)]();
}
function op4D(){
	writeMem(0, 0x4D);
	decode[readMem(0)]();
}
function op4E(){
	writeMem(0, 0x4E);
	decode[readMem(0)]();
}
function op4F(){
	writeMem(0, 0x4F);
	decode[readMem(0)]();
}
function op50(){
	writeMem(0, 0x50);
	decode[readMem(0)]();
}
function op51(){
	writeMem(0, 0x51);
	decode[readMem(0)]();
}
function op52(){
	writeMem(0, 0x52);
	decode[readMem(0)]();
}
function op53(){
	writeMem(0, 0x53);
	decode[readMem(0)]();
}
function op54(){
	writeMem(0, 0x54);
	decode[readMem(0)]();
}
function op55(){
	writeMem(0, 0x55);
	decode[readMem(0)]();
}
function op56(){
	writeMem(0, 0x56);
	decode[readMem(0)]();
}
function op57(){
	writeMem(0, 0x57);
	decode[readMem(0)]();
}
function op58(){
	writeMem(0, 0x58);
	decode[readMem(0)]();
}
function op59(){
	writeMem(0, 0x59);
	decode[readMem(0)]();
}
function op5A(){
	writeMem(0, 0x5A);
	decode[readMem(0)]();
}
function op5B(){
	writeMem(0, 0x5B);
	decode[readMem(0)]();
}
function op5C(){
	writeMem(0, 0x5C);
	decode[readMem(0)]();
}
function op5D(){
	writeMem(0, 0x5D);
	decode[readMem(0)]();
}
function op5E(){
	writeMem(0, 0x5E);
	decode[readMem(0)]();
}
function op5F(){
	writeMem(0, 0x5F);
	decode[readMem(0)]();
}
function op60(){
	writeMem(0, 0x60);
	decode[readMem(0)]();
}
function op61(){
	writeMem(0, 0x61);
	decode[readMem(0)]();
}
function op62(){
	writeMem(0, 0x62);
	decode[readMem(0)]();
}
function op63(){
	writeMem(0, 0x63);
	decode[readMem(0)]();
}
function op64(){
	writeMem(0, 0x64);
	decode[readMem(0)]();
}
function op65(){
	writeMem(0, 0x65);
	decode[readMem(0)]();
}
function op66(){
	writeMem(0, 0x66);
	decode[readMem(0)]();
}
function op67(){
	writeMem(0, 0x67);
	decode[readMem(0)]();
}
function op68(){
	writeMem(0, 0x68);
	decode[readMem(0)]();
}
function op69(){
	writeMem(0, 0x69);
	decode[readMem(0)]();
}
function op6A(){
	writeMem(0, 0x6A);
	decode[readMem(0)]();
}
function op6B(){
	writeMem(0, 0x6B);
	decode[readMem(0)]();
}
function op6C(){
	writeMem(0, 0x6C);
	decode[readMem(0)]();
}
function op6D(){
	writeMem(0, 0x6D);
	decode[readMem(0)]();
}
function op6E(){
	writeMem(0, 0x6E);
	decode[readMem(0)]();
}
function op6F(){
	writeMem(0, 0x6F);
	decode[readMem(0)]();
}
function op70(){
	writeMem(0, 0x70);
	decode[readMem(0)]();
}
function op71(){
	writeMem(0, 0x71);
	decode[readMem(0)]();
}
function op72(){
	writeMem(0, 0x72);
	decode[readMem(0)]();
}
function op73(){
	writeMem(0, 0x73);
	decode[readMem(0)]();
}
function op74(){
	writeMem(0, 0x74);
	decode[readMem(0)]();
}
function op75(){
	writeMem(0, 0x75);
	decode[readMem(0)]();
}
function op76(){
	writeMem(0, 0x76);
	decode[readMem(0)]();
}
function op77(){
	writeMem(0, 0x77);
	decode[readMem(0)]();
}
function op78(){
	writeMem(0, 0x78);
	decode[readMem(0)]();
}
function op79(){
	writeMem(0, 0x79);
	decode[readMem(0)]();
}
function op7A(){
	writeMem(0, 0x7A);
	decode[readMem(0)]();
}
function op7B(){
	writeMem(0, 0x7B);
	decode[readMem(0)]();
}
function op7C(){
	writeMem(0, 0x7C);
	decode[readMem(0)]();
}
function op7D(){
	writeMem(0, 0x7D);
	decode[readMem(0)]();
}
function op7E(){
	writeMem(0, 0x7E);
	decode[readMem(0)]();
}
function op7F(){
	writeMem(0, 0x7F);
	decode[readMem(0)]();
}
function op80(){
	writeMem(0, 0x80);
	decode[readMem(0)]();
}
function op81(){
	writeMem(0, 0x81);
	decode[readMem(0)]();
}
function op82(){
	writeMem(0, 0x82);
	decode[readMem(0)]();
}
function op83(){
	writeMem(0, 0x83);
	decode[readMem(0)]();
}
function op84(){
	writeMem(0, 0x84);
	decode[readMem(0)]();
}
function op85(){
	writeMem(0, 0x85);
	decode[readMem(0)]();
}
function op86(){
	writeMem(0, 0x86);
	decode[readMem(0)]();
}
function op87(){
	writeMem(0, 0x87);
	decode[readMem(0)]();
}
function op88(){
	writeMem(0, 0x88);
	decode[readMem(0)]();
}
function op89(){
	writeMem(0, 0x89);
	decode[readMem(0)]();
}
function op8A(){
	writeMem(0, 0x8A);
	decode[readMem(0)]();
}
function op8B(){
	writeMem(0, 0x8B);
	decode[readMem(0)]();
}
function op8C(){
	writeMem(0, 0x8C);
	decode[readMem(0)]();
}
function op8D(){
	writeMem(0, 0x8D);
	decode[readMem(0)]();
}
function op8E(){
	writeMem(0, 0x8E);
	decode[readMem(0)]();
}
function op8F(){
	writeMem(0, 0x8F);
	decode[readMem(0)]();
}
function op90(){
	writeMem(0, 0x90);
	decode[readMem(0)]();
}
function op91(){
	writeMem(0, 0x91);
	decode[readMem(0)]();
}
function op92(){
	writeMem(0, 0x92);
	decode[readMem(0)]();
}
function op93(){
	writeMem(0, 0x93);
	decode[readMem(0)]();
}
function op94(){
	writeMem(0, 0x94);
	decode[readMem(0)]();
}
function op95(){
	writeMem(0, 0x95);
	decode[readMem(0)]();
}
function op96(){
	writeMem(0, 0x96);
	decode[readMem(0)]();
}
function op97(){
	writeMem(0, 0x97);
	decode[readMem(0)]();
}
function op98(){
	writeMem(0, 0x98);
	decode[readMem(0)]();
}
function op99(){
	writeMem(0, 0x99);
	decode[readMem(0)]();
}
function op9A(){
	writeMem(0, 0x9A);
	decode[readMem(0)]();
}
function op9B(){
	writeMem(0, 0x9B);
	decode[readMem(0)]();
}
function op9C(){
	writeMem(0, 0x9C);
	decode[readMem(0)]();
}
function op9D(){
	writeMem(0, 0x9D);
	decode[readMem(0)]();
}
function op9E(){
	writeMem(0, 0x9E);
	decode[readMem(0)]();
}
function op9F(){
	writeMem(0, 0x9F);
	decode[readMem(0)]();
}
function opA0(){
	writeMem(0, 0xA0);
	decode[readMem(0)]();
}
function opA1(){
	writeMem(0, 0xA1);
	decode[readMem(0)]();
}
function opA2(){
	writeMem(0, 0xA2);
	decode[readMem(0)]();
}
function opA3(){
	writeMem(0, 0xA3);
	decode[readMem(0)]();
}
function opA4(){
	writeMem(0, 0xA4);
	decode[readMem(0)]();
}
function opA5(){
	writeMem(0, 0xA5);
	decode[readMem(0)]();
}
function opA6(){
	writeMem(0, 0xA6);
	decode[readMem(0)]();
}
function opA7(){
	writeMem(0, 0xA7);
	decode[readMem(0)]();
}
function opA8(){
	writeMem(0, 0xA8);
	decode[readMem(0)]();
}
function opA9(){
	writeMem(0, 0xA9);
	decode[readMem(0)]();
}
function opAA(){
	writeMem(0, 0xAA);
	decode[readMem(0)]();
}
function opAB(){
	writeMem(0, 0xAB);
	decode[readMem(0)]();
}
function opAC(){
	writeMem(0, 0xAC);
	decode[readMem(0)]();
}
function opAD(){
	writeMem(0, 0xAD);
	decode[readMem(0)]();
}
function opAE(){
	writeMem(0, 0xAE);
	decode[readMem(0)]();
}
function opAF(){
	writeMem(0, 0xAF);
	decode[readMem(0)]();
}
function opB0(){
	writeMem(0, 0xB0);
	decode[readMem(0)]();
}
function opB1(){
	writeMem(0, 0xB1);
	decode[readMem(0)]();
}
function opB2(){
	writeMem(0, 0xB2);
	decode[readMem(0)]();
}
function opB3(){
	writeMem(0, 0xB3);
	decode[readMem(0)]();
}
function opB4(){
	writeMem(0, 0xB4);
	decode[readMem(0)]();
}
function opB5(){
	writeMem(0, 0xB5);
	decode[readMem(0)]();
}
function opB6(){
	writeMem(0, 0xB6);
	decode[readMem(0)]();
}
function opB7(){
	writeMem(0, 0xB7);
	decode[readMem(0)]();
}
function opB8(){
	writeMem(0, 0xB8);
	decode[readMem(0)]();
}
function opB9(){
	writeMem(0, 0xB9);
	decode[readMem(0)]();
}
function opBA(){
	writeMem(0, 0xBA);
	decode[readMem(0)]();
}
function opBB(){
	writeMem(0, 0xBB);
	decode[readMem(0)]();
}
function opBC(){
	writeMem(0, 0xBC);
	decode[readMem(0)]();
}
function opBD(){
	writeMem(0, 0xBD);
	decode[readMem(0)]();
}
function opBE(){
	writeMem(0, 0xBE);
	decode[readMem(0)]();
}
function opBF(){
	writeMem(0, 0xBF);
	decode[readMem(0)]();
}
function opC0(){
	writeMem(0, 0xC0);
	decode[readMem(0)]();
}
function opC1(){
	writeMem(0, 0xC1);
	decode[readMem(0)]();
}
function opC2(){
	writeMem(0, 0xC2);
	decode[readMem(0)]();
}
function opC3(){
	writeMem(0, 0xC3);
	decode[readMem(0)]();
}
function opC4(){
	writeMem(0, 0xC4);
	decode[readMem(0)]();
}
function opC5(){
	writeMem(0, 0xC5);
	decode[readMem(0)]();
}
function opC6(){
	writeMem(0, 0xC6);
	decode[readMem(0)]();
}
function opC7(){
	writeMem(0, 0xC7);
	decode[readMem(0)]();
}
function opC8(){
	writeMem(0, 0xC8);
	decode[readMem(0)]();
}
function opC9(){
	writeMem(0, 0xC9);
	decode[readMem(0)]();
}
function opCA(){
	writeMem(0, 0xCA);
	decode[readMem(0)]();
}
function opCB(){
	writeMem(0, 0xCB);
	decode[readMem(0)]();
}
function opCC(){
	writeMem(0, 0xCC);
	decode[readMem(0)]();
}
function opCD(){
	writeMem(0, 0xCD);
	decode[readMem(0)]();
}
function opCE(){
	writeMem(0, 0xCE);
	decode[readMem(0)]();
}
function opCF(){
	writeMem(0, 0xCF);
	decode[readMem(0)]();
}
function opD0(){
	writeMem(0, 0xD0);
	decode[readMem(0)]();
}
function opD1(){
	writeMem(0, 0xD1);
	decode[readMem(0)]();
}
function opD2(){
	writeMem(0, 0xD2);
	decode[readMem(0)]();
}
function opD3(){
	writeMem(0, 0xD3);
	decode[readMem(0)]();
}
function opD4(){
	writeMem(0, 0xD4);
	decode[readMem(0)]();
}
function opD5(){
	writeMem(0, 0xD5);
	decode[readMem(0)]();
}
function opD6(){
	writeMem(0, 0xD6);
	decode[readMem(0)]();
}
function opD7(){
	writeMem(0, 0xD7);
	decode[readMem(0)]();
}
function opD8(){
	writeMem(0, 0xD8);
	decode[readMem(0)]();
}
function opD9(){
	writeMem(0, 0xD9);
	decode[readMem(0)]();
}
function opDA(){
	writeMem(0, 0xDA);
	decode[readMem(0)]();
}
function opDB(){
	writeMem(0, 0xDB);
	decode[readMem(0)]();
}
function opDC(){
	writeMem(0, 0xDC);
	decode[readMem(0)]();
}
function opDD(){
	writeMem(0, 0xDD);
	decode[readMem(0)]();
}
function opDE(){
	writeMem(0, 0xDE);
	decode[readMem(0)]();
}
function opDF(){
	writeMem(0, 0xDF);
	decode[readMem(0)]();
}
function opE0(){
	writeMem(0, 0xE0);
	decode[readMem(0)]();
}
function opE1(){
	writeMem(0, 0xE1);
	decode[readMem(0)]();
}
function opE2(){
	writeMem(0, 0xE2);
	decode[readMem(0)]();
}
function opE3(){
	writeMem(0, 0xE3);
	decode[readMem(0)]();
}
function opE4(){
	writeMem(0, 0xE4);
	decode[readMem(0)]();
}
function opE5(){
	writeMem(0, 0xE5);
	decode[readMem(0)]();
}
function opE6(){
	writeMem(0, 0xE6);
	decode[readMem(0)]();
}
function opE7(){
	writeMem(0, 0xE7);
	decode[readMem(0)]();
}
function opE8(){
	writeMem(0, 0xE8);
	decode[readMem(0)]();
}
function opE9(){
	writeMem(0, 0xE9);
	decode[readMem(0)]();
}
function opEA(){
	writeMem(0, 0xEA);
	decode[readMem(0)]();
}
function opEB(){
	writeMem(0, 0xEB);
	decode[readMem(0)]();
}
function opEC(){
	writeMem(0, 0xEC);
	decode[readMem(0)]();
}
function opED(){
	writeMem(0, 0xED);
	decode[readMem(0)]();
}
function opEE(){
	writeMem(0, 0xEE);
	decode[readMem(0)]();
}
function opEF(){
	writeMem(0, 0xEF);
	decode[readMem(0)]();
}
function opF0(){
	writeMem(0, 0xF0);
	decode[readMem(0)]();
}
function opF1(){
	writeMem(0, 0xF1);
	decode[readMem(0)]();
}
function opF2(){
	writeMem(0, 0xF2);
	decode[readMem(0)]();
}
function opF3(){
	writeMem(0, 0xF3);
	decode[readMem(0)]();
}
function opF4(){
	writeMem(0, 0xF4);
	decode[readMem(0)]();
}
function opF5(){
	writeMem(0, 0xF5);
	decode[readMem(0)]();
}
function opF6(){
	writeMem(0, 0xF6);
	decode[readMem(0)]();
}
function opF7(){
	writeMem(0, 0xF7);
	decode[readMem(0)]();
}
function opF8(){
	writeMem(0, 0xF8);
	decode[readMem(0)]();
}
function opF9(){
	writeMem(0, 0xF9);
	decode[readMem(0)]();
}
function opFA(){
	writeMem(0, 0xFA);
	decode[readMem(0)]();
}
function opFB(){
	writeMem(0, 0xFB);
	decode[readMem(0)]();
}
function opFC(){
	writeMem(0, 0xFC);
	decode[readMem(0)]();
}
function opFD(){
	writeMem(0, 0xFD);
	decode[readMem(0)]();
}
function opFE(){
	writeMem(0, 0xFE);
	decode[readMem(0)]();
}
function opFF(){
	writeMem(0, 0xFF);
	decode[readMem(0)]();
}

function testAll() {
    return [op0(), op1(), op2(), op3(), op4(), op5(), op6(), op7(), op8(), op9(), opA(), opB(), opC(), opD(), opE(), opF(), 
            op10(), op11(), op12(), op13(), op14(), op15(), op16(), op17(), op18(), op19(), op1A(), op1B(), op1C(), op1D(), op1E(), op1F(), 
            op20(), op21(), op22(), op23(), op24(), op25(), op26(), op27(), op28(), op29(), op2A(), op2B(), op2C(), op2D(), op2E(), op2F(), 
            op30(), op31(), op32(), op33(), op34(), op35(), op36(), op37(), op38(), op39(), op3A(), op3B(), op3C(), op3D(), op3E(), op3F(), 
            op40(), op41(), op42(), op43(), op44(), op45(), op46(), op47(), op48(), op49(), op4A(), op4B(), op4C(), op4D(), op4E(), op4F(), 
            op50(), op51(), op52(), op53(), op54(), op55(), op56(), op57(), op58(), op59(), op5A(), op5B(), op5C(), op5D(), op5E(), op5F(), 
            op60(), op61(), op62(), op63(), op64(), op65(), op66(), op67(), op68(), op69(), op6A(), op6B(), op6C(), op6D(), op6E(), op6F(), 
            op70(), op71(), op72(), op73(), op74(), op75(), op76(), op77(), op78(), op79(), op7A(), op7B(), op7C(), op7D(), op7E(), op7F(), 
            op80(), op81(), op82(), op83(), op84(), op85(), op86(), op87(), op88(), op89(), op8A(), op8B(), op8C(), op8D(), op8E(), op8F(), 
            op90(), op91(), op92(), op93(), op94(), op95(), op96(), op97(), op98(), op99(), op9A(), op9B(), op9C(), op9D(), op9E(), op9F(), 
            opA0(), opA1(), opA2(), opA3(), opA4(), opA5(), opA6(), opA7(), opA8(), opA9(), opAA(), opAB(), opAC(), opAD(), opAE(), opAF(), 
            opB0(), opB1(), opB2(), opB3(), opB4(), opB5(), opB6(), opB7(), opB8(), opB9(), opBA(), opBB(), opBC(), opBD(), opBE(), opBF(), 
            opC0(), opC1(), opC2(), opC3(), opC4(), opC5(), opC6(), opC7(), opC8(), opC9(), opCA(), opCB(), opCC(), opCD(), opCE(), opCF(), 
            opD0(), opD1(), opD2(), opD3(), opD4(), opD5(), opD6(), opD7(), opD8(), opD9(), opDA(), opDB(), opDC(), opDD(), opDE(), opDF(), 
            opE0(), opE1(), opE2(), opE3(), opE4(), opE5(), opE6(), opE7(), opE8(), opE9(), opEA(), opEB(), opEC(), opED(), opEE(), opEF(), 
            opF0(), opF1(), opF2(), opF3(), opF4(), opF5(), opF6(), opF7(), opF8(), opF9(), opFA(), opFB(), opFC(), opFD(), opFE(), opFF()];
}