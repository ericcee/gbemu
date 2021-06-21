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
    reg[SP]=0;
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
	writeMem(0, 0x0A);
    reg[BC] = 0x1234;
    writeMem(reg[BC], 123);
    
	var cpul = decode[readMem(0)]();
    var passes = [];
    passes.push(reg[PC] == 1);
    passes.push(cpul == 8);
    passes.push(getByteRegister(A) == 123);
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function opB(){ // DEC BC
    reset();
	writeMem(0, 0xB);
    var z = getFlag(_Z);
    var h = getFlag(_H);
    var n = getFlag(_N);
    var c = getFlag(_C);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(reg[PC] == 1);
    passes.push(cpul == 8);
    passes.push(reg[BC] == 0xFFFF);
    passes.push(getFlag(_Z) == z);
    passes.push(getFlag(_H) == h);
    passes.push(getFlag(_N) == n);
    passes.push(getFlag(_C) == c);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function opC(){ // INC C
    reset();
    
	writeMem(0, 0xC);
    var oldCarry = getFlag(_C);
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==1, cpul == 4, getByteRegister(C) == 1, getFlag(_Z) == 0, getFlag(_N) == 0, getFlag(_H) == 0, oldCarry == getFlag(_C)];
    reg[PC] = 0;
    
    setByteRegister(C, 0x0F);
    cpul = decode[readMem(0)]();
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_C) == oldCarry);
    reg[PC] = 0;
    
    setByteRegister(C, 0xFF);
    cpul = decode[readMem(0)]();
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_C) == oldCarry);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function opD(){ // DEC C
    reset();
	writeMem(0, 0xD);
    setByteRegister(C, 1);
    var c = getFlag(_C);
	var cpul = decode[readMem(0)]();
    var passes = [];
    passes.push(reg[PC] == 1);
    passes.push(cpul == 4);
    passes.push(getFlag(_N) == 1);
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_H) == 0);
    passes.push(getByteRegister(C) == 0);
    reset();
    setByteRegister(C, 0xFF);
    var cpul = decode[readMem(0)]();
    passes.push(getFlag(_N) == 1);
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_H) == 0);
    passes.push(getByteRegister(C) == 0xFE);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function opE(){ // LD C,d8
    reset();
	writeMem(0, 0xE);
    writeMem(1, 123)
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(cpul == 8);
    passes.push(reg[PC] == 2);
    passes.push(getByteRegister(C) == 123);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function opF(){ // RRCA
    reset();
    setByteRegister(A, 0b00000001);
	writeMem(0, 0xF);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_C) == 1);
    passes.push(getByteRegister(A) == 0b10000000);
    passes.push(cpul == 4);
    passes.push(reg[PC] == 1);
    reset();
    
    setByteRegister(A, 0b00010000);
    decode[readMem(0)]();
    passes.push(getByteRegister(A) == 0b00001000);
    passes.push(getFlag(_C) == 0);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op10(){ // STOP 0
    reset();
	writeMem(0, 0x10);
    writeMem(1, 0x00);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(reg[PC] == 2);
    passes.push(cpul == 4);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op11(){ // LD DE,d16
    reset();
	writeMem(0, 0x11);
    writeMem(1, 0x34);
    writeMem(2, 0x12);
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==3, cpul == 12, reg[DE]==0x1234];
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op12(){ // LD (DE),A
    reset();
	writeMem(0, 0x12);
    reg[DE] = 0x1234;
    setByteRegister(A, 121);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(cpul == 8);
    passes.push(reg[PC] == 1);
    passes.push(readMem(reg[DE]) == 121);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op13(){ // INC DE
    reset();
	writeMem(0, 0x13);
    
	var z = getFlag(_Z);
    var h = getFlag(_H);
    var n = getFlag(_N);
    var c = getFlag(_C);
    
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==1, cpul == 8, reg[DE] == 1];
    passes.push(getFlag(_Z) == z);
    passes.push(getFlag(_H) == h);
    passes.push(getFlag(_N) == n);
    passes.push(getFlag(_C) == c);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op14(){ // INC D
    reset();
	writeMem(0, 0x14);
	var oldCarry = getFlag(_C);
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==1, cpul == 4, getByteRegister(D) == 1, getFlag(_Z) == 0, getFlag(_N) == 0, getFlag(_H) == 0, oldCarry == getFlag(_C)];
    reg[PC] = 0;
    
    setByteRegister(D, 0x0F);
    cpul = decode[readMem(0)]();
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_C) == oldCarry);
    reg[PC] = 0;
    
    setByteRegister(D, 0xFF);
    cpul = decode[readMem(0)]();
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_C) == oldCarry);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op15(){ // DEC D
    reset();
	writeMem(0, 0x15);
    setByteRegister(D, 1);
    var c = getFlag(_C);
	var cpul = decode[readMem(0)]();
    var passes = [];
    passes.push(reg[PC] == 1);
    passes.push(cpul == 4);
    passes.push(getFlag(_N) == 1);
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_H) == 0);
    passes.push(getByteRegister(D) == 0);
    reset();
    setByteRegister(D, 0xFF);
    var cpul = decode[readMem(0)]();
    passes.push(getFlag(_N) == 1);
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_H) == 0);
    passes.push(getByteRegister(D) == 0xFE);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op16(){ // LD D,d8
    reset();
	writeMem(0, 0x16);
    writeMem(1, 123);
	var cpul = decode[readMem(0)]();
    var passes = [];
    passes.push(getByteRegister(D) == 123);
    passes.push(reg[PC] == 2);
    passes.push(cpul == 8);
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op17(){ // RLA
    reset();
    setByteRegister(A, 0b10000000);
	writeMem(0, 0x17);
	var cpul = decode[readMem(0)]();
    
    
    var passes = [];
    passes.push(getByteRegister(A) == 0);
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_C) == 1);
    passes.push(cpul == 4);
    passes.push(reg[PC] == 1);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op18(){ // JR r8
    reset();
	writeMem(0, 0x18);
    writeMem(1, 127);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(reg[PC] == 129);
    passes.push(cpul == 12);
    
    reset();
    writeMem(1, -127);
    decode[readMem(0)]();
    passes.push(reg[PC] == -125);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op19(){ // ADD HL,DE
    reset();
	writeMem(0, 0x19);
	reg[HL] = 0xFF00;
    reg[DE] = 0xFF;
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(cpul == 8);
    passes.push(reg[PC] == 1);
    passes.push(reg[HL] == 0xFFFF);
    passes.push(getFlag(_C) == 0);
    reset();
    reg[HL] = 0xFFFF;
    reg[DE] = 0x01;
	decode[readMem(0)]();
    passes.push(reg[HL] == 0);
    passes.push(getFlag(_C) == 1);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op1A(){ // LD A,(DE)
    reset();
	writeMem(0, 0x1A);
    reg[DE] = 0x1234;
    writeMem(reg[DE], 123);
    
	var cpul = decode[readMem(0)]();
    var passes = [];
    passes.push(reg[PC] == 1);
    passes.push(cpul == 8);
    passes.push(getByteRegister(A) == 123);
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op1B(){ // DEC DE
    reset();
	writeMem(0, 0x1B);
	var z = getFlag(_Z);
    var h = getFlag(_H);
    var n = getFlag(_N);
    var c = getFlag(_C);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(reg[PC] == 1);
    passes.push(cpul == 8);
    passes.push(reg[DE] == 0xFFFF);
    passes.push(getFlag(_Z) == z);
    passes.push(getFlag(_H) == h);
    passes.push(getFlag(_N) == n);
    passes.push(getFlag(_C) == c);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op1C(){ // INC E
    reset();
	writeMem(0, 0x1C);
    
    var oldCarry = getFlag(_C);
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==1, cpul == 4, getByteRegister(E) == 1, getFlag(_Z) == 0, getFlag(_N) == 0, getFlag(_H) == 0, oldCarry == getFlag(_C)];
    reg[PC] = 0;
    
    setByteRegister(E, 0x0F);
    cpul = decode[readMem(0)]();
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_C) == oldCarry);
    reg[PC] = 0;
    
    setByteRegister(E, 0xFF);
    cpul = decode[readMem(0)]();
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_C) == oldCarry);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op1D(){ // DEC E
    reset();
	writeMem(0, 0x1D);
    setByteRegister(E, 1);
    var c = getFlag(_C);
	var cpul = decode[readMem(0)]();
    var passes = [];
    passes.push(reg[PC] == 1);
    passes.push(cpul == 4);
    passes.push(getFlag(_N) == 1);
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_H) == 0);
    passes.push(getByteRegister(E) == 0);
    reset();
    setByteRegister(E, 0xFF);
    var cpul = decode[readMem(0)]();
    passes.push(getFlag(_N) == 1);
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_H) == 0);
    passes.push(getByteRegister(E) == 0xFE);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op1E(){ // LD E,d8
    reset();
	writeMem(0, 0x1E);
    writeMem(1, 0xFE);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(getByteRegister(E) == 0xFE);
    passes.push(reg[PC] == 2);
    passes.push(cpul == 8);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op1F(){ // RRA
    reset();
	writeMem(0, 0x1F);
    setByteRegister(A, 0b00000001);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(getByteRegister(A) == 0);
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_C) == 1);
    
    reset();
    setByteRegister(A, 0b00001001);
    decode[readMem(0)]();
    passes.push(getByteRegister(A) == 0b00000100);
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_C) == 1);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op20(){ // JR NZ,r8
    reset();
	writeMem(0, 0x20);
    writeMem(1, 123);
    setFlag(_Z, 1);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(cpul == 8);
    passes.push(reg[PC] == 2);
    
    reset();
    setFlag(_Z, 0);
	var cpul = decode[readMem(0)]();
    passes.push(cpul == 12);
    passes.push(reg[PC] == 125);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op21(){ // LD HL,d16
    reset();
	writeMem(0, 0x21);
    writeMem(1, 0x34);
    writeMem(2, 0x12);
    
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(reg[HL] == 0x1234);
    passes.push(reg[PC] == 3);
    passes.push(cpul == 12);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op22(){ // LD (HL+),A
    reset();
	writeMem(0, 0x22);
    reg[HL] = 0x1234;
    setByteRegister(A, 122);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(readMem(0x1234) == 122);
    passes.push(reg[HL] == 0x1235);
    passes.push(cpul == 8);
    passes.push(reg[PC] == 1);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op23(){ // INC HL
    reset();
	writeMem(0, 0x23);
	var z = getFlag(_Z);
    var h = getFlag(_H);
    var n = getFlag(_N);
    var c = getFlag(_C);
    
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==1, cpul == 8, reg[HL] == 1];
    passes.push(getFlag(_Z) == z);
    passes.push(getFlag(_H) == h);
    passes.push(getFlag(_N) == n);
    passes.push(getFlag(_C) == c);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op24(){ // INC H
    reset();
	writeMem(0, 0x24);
    
    var oldCarry = getFlag(_C);
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==1, cpul == 4, getByteRegister(H) == 1, getFlag(_Z) == 0, getFlag(_N) == 0, getFlag(_H) == 0, oldCarry == getFlag(_C)];
    
    reg[PC] = 0;
    
    setByteRegister(H, 0x0F);
    cpul = decode[readMem(0)]();
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_C) == oldCarry);
    reg[PC] = 0;
    
    setByteRegister(H, 0xFF);
    cpul = decode[readMem(0)]();
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_C) == oldCarry);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op25(){ // DEC H
    reset();
	writeMem(0, 0x25);
	setByteRegister(H, 1);
    var c = getFlag(_C);
	var cpul = decode[readMem(0)]();
    var passes = [];
    passes.push(reg[PC] == 1);
    passes.push(cpul == 4);
    passes.push(getFlag(_N) == 1);
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_H) == 0);
    passes.push(getByteRegister(H) == 0);
    reset();
    setByteRegister(H, 0xFF);
    var cpul = decode[readMem(0)]();
    passes.push(getFlag(_N) == 1);
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_H) == 0);
    passes.push(getByteRegister(H) == 0xFE);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op26(){ // LD H,d8
    reset();
	writeMem(0, 0x26);
    writeMem(1, 123);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(reg[PC] == 2);
    passes.push(cpul == 8);
    passes.push(getByteRegister(H) == 123);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op27(){ // DAA
    reset();
    setByteRegister(A, 0x0F);
	writeMem(0, 0x27);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(getByteRegister(A) == 0x15);
    passes.push(cpul == 4);
    passes.push(reg[PC] == 1);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op28(){ // JR Z,r8
    reset();
	writeMem(0, 0x28);
    writeMem(1, 123);
    setFlag(_Z, 0);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(cpul == 8);
    passes.push(reg[PC] == 2);
    
    reset();
    setFlag(_Z, 1);
	var cpul = decode[readMem(0)]();
    passes.push(cpul == 12);
    passes.push(reg[PC] == 125);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op29(){ // ADD HL,HL
    reset();
	writeMem(0, 0x29);
    reg[HL] = 0xFF;
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(cpul == 8);
    passes.push(reg[PC] == 1);
    passes.push(reg[HL] == 0xFF+0xFF);
    passes.push(getFlag(_C) == 0);
    reset();
    reg[HL] = 0xFFFF;
	decode[readMem(0)]();
    passes.push(reg[HL] == 0xFFFE);
    passes.push(getFlag(_C) == 1);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op2A(){ // LD A,(HL+)
    reset();
    reg[HL] = 0x1234;
    writeMem(reg[HL], 123);
	writeMem(0, 0x2A);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    
    passes.push(reg[HL] == 0x1235);
    passes.push(getByteRegister(A) == 123);
    passes.push(cpul == 8);
    passes.push(reg[PC] == 1);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op2B(){ // DEC HL
    reset();
	writeMem(0, 0x2B);
	var z = getFlag(_Z);
    var h = getFlag(_H);
    var n = getFlag(_N);
    var c = getFlag(_C);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(reg[PC] == 1);
    passes.push(cpul == 8);
    passes.push(reg[HL] == 0xFFFF);
    passes.push(getFlag(_Z) == z);
    passes.push(getFlag(_H) == h);
    passes.push(getFlag(_N) == n);
    passes.push(getFlag(_C) == c);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op2C(){ // INC L
    reset();
	writeMem(0, 0x2C);
	var oldCarry = getFlag(_C);
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==1, cpul == 4, getByteRegister(L) == 1, getFlag(_Z) == 0, getFlag(_N) == 0, getFlag(_H) == 0, oldCarry == getFlag(_C)];
    reg[PC] = 0;
    
    setByteRegister(L, 0x0F);
    cpul = decode[readMem(0)]();
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_C) == oldCarry);
    reg[PC] = 0;
    
    setByteRegister(L, 0xFF);
    cpul = decode[readMem(0)]();
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_C) == oldCarry);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op2D(){ // DEC L
    reset();
	writeMem(0, 0x2D);
	setByteRegister(L, 1);
    var c = getFlag(_C);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(reg[PC] == 1);
    passes.push(cpul == 4);
    passes.push(getFlag(_N) == 1);
    passes.push(getFlag(_Z) == 1);
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_H) == 0);
    passes.push(getByteRegister(L) == 0);
    reset();
    setByteRegister(L, 0xFF);
    var cpul = decode[readMem(0)]();
    passes.push(getFlag(_N) == 1);
    passes.push(getFlag(_Z) == 0);
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_H) == 0);
    passes.push(getByteRegister(L) == 0xFE);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op2E(){ // LD L,d8
    reset();
	writeMem(0, 0x2E);
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
    passes.push(getByteRegister(L) == 123);
    passes.push(reg[PC] == 2);
    passes.push(cpul == 8);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op2F(){ // CPL
    reset();
    setByteRegister(A, 123);
	writeMem(0, 0x2F);
    var z = getFlag(_Z);
    var c = getFlag(_C);
    
	var cpul = decode[readMem(0)]();
    var passes = [];
    passes.push(getByteRegister(A) == ((~123)&0xFF));
    passes.push(getFlag(_C) == c);
    passes.push(getFlag(_Z) == z);
    passes.push(getFlag(_H) == 1);
    passes.push(getFlag(_N) == 1);
    passes.push(reg[PC] == 1);
    passes.push(cpul == 4);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op30(){ // JR NC,r8
    reset();
	writeMem(0, 0x30);
    writeMem(1, 55); 
    setFlag(_C, 1);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(cpul == 8);
    passes.push(reg[PC] == 2);
    reset();
    setFlag(_C, 0);
	cpul = decode[readMem(0)]();
    passes.push(cpul == 12);
    passes.push(reg[PC] == 57);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op31(){ // LD SP,d16
    reset();
	writeMem(0, 0x31);
    writeMem(1, 0x34);
    writeMem(2, 0x12);
    
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    
    passes.push(reg[SP] == 0x1234);
    passes.push(cpul == 12);
    passes.push(reg[PC] == 3);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op32(){ // LD (HL-),A
    reset();
	writeMem(0, 0x32);
    setByteRegister(A, 123);
    reg[HL] = 0x1235;
    
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    
    passes.push(reg[HL] == 0x1234);
    passes.push(reg[PC] == 1);
    passes.push(cpul == 8);
    passes.push(readMem(0x1235) == 123);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op33(){ // INC SP
    reset();
	writeMem(0, 0x33);
    var z = getFlag(_Z);
    var h = getFlag(_H);
    var n = getFlag(_N);
    var c = getFlag(_C);
    
	var cpul = decode[readMem(0)]();
    
    var passes = [reg[PC]==1, cpul == 8, reg[SP] == 1];
    passes.push(getFlag(_Z) == z);
    passes.push(getFlag(_H) == h);
    passes.push(getFlag(_N) == n);
    passes.push(getFlag(_C) == c);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op34(){ // INC (HL)
    reset();
    reg[HL] = 0x5555;
	writeMem(0, 0x34);
	var cpul = decode[readMem(0)]();
    var passes = [];
    
    passes.push(readMem(reg[HL]) == 1);
    passes.push(cpul == 12);
    passes.push(reg[PC] == 1);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op35(){ // DEC (HL)
    reset();
    reg[HL] = 0x5554;
	writeMem(0, 0x35);
	var cpul = decode[readMem(0)]();
    var passes = [];
    
    passes.push(readMem(reg[HL]) == 0xFF);
    passes.push(cpul == 12);
    passes.push(reg[PC] == 1);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op36(){ // LD (HL),d8
    reset();
    reg[HL] = 0xFFD;
	writeMem(0, 0x36);
    writeMem(1, 123);
    
	var cpul = decode[readMem(0)]();
    var passes = [];
    passes.push(readMem(reg[HL]) == 123);
    passes.push(reg[PC] == 2);
    passes.push(cpul == 12);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op37(){ // SCF
    reset();
	writeMem(0, 0x37);
    var z = getFlag(_Z);
    setFlag(_H, 1);
    setFlag(_N, 1);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(getFlag(_C) == 1);
    passes.push(reg[PC] == 1);
    passes.push(cpul == 4);
    passes.push(getFlag(_H) == 0);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_Z) == z);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op38(){ // JR C,r8
    reset();
	writeMem(0, 0x38);
    writeMem(1, 123);
    setFlag(_C, 0);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(cpul == 8);
    passes.push(reg[PC] == 2);
    
    reset();
    setFlag(_C, 1);
	cpul = decode[readMem(0)]();
    passes.push(cpul == 12);
    passes.push(reg[PC] == 125);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
}
function op39(){ // ADD HL,SP
	writeMem(0, 0x39);
	decode[readMem(0)]();
}
function op3A(){ // LD A,(HL-)
	writeMem(0, 0x3A);
	decode[readMem(0)]();
}
function op3B(){ // DEC SP
	writeMem(0, 0x3B);
	decode[readMem(0)]();
}
function op3C(){ // INC A
	writeMem(0, 0x3C);
	decode[readMem(0)]();
}
function op3D(){ // DEC A
	writeMem(0, 0x3D);
	decode[readMem(0)]();
}
function op3E(){ // LD A,d8
	writeMem(0, 0x3E);
	decode[readMem(0)]();
}
function op3F(){ // CCF
    reset();
	writeMem(0, 0x3F);
    var z = getFlag(_Z);
    setFlag(_H, 1);
    setFlag(_N, 1);
    setFlag(_C, 0);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    passes.push(getFlag(_C) == 1);
    passes.push(reg[PC] == 1);
    passes.push(cpul == 4);
    passes.push(getFlag(_H) == 0);
    passes.push(getFlag(_N) == 0);
    passes.push(getFlag(_Z) == z);
    reset();
    setFlag(_C, 1);
    decode[readMem(0)]();
    passes.push(getFlag(_C) == 0);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
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
function opE0(){ // LDH (a8),A
    reset();
    setByteRegister(A, 123);
	writeMem(0, 0xE0);
    writeMem(1, 0x47);
	var cpul = decode[readMem(0)]();
    
    var passes = [];
    
    passes.push(reg[PC] == 2);
    passes.push(cpul == 12);
    passes.push(readMem(0xFF47) == 123);
    
    for(var i = 0; i < passes.length; i++) if(!passes[i]) return i;
    return true;
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
function opF0(){ // LDH A,(a8)
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

function printTest() {
    var allt = testAll();
    var bp = 0;
    for(var a = 0; a < 0x0f+1; a++){
        for(var b = 0; b < 0x0f+1; b++){
            console.log(bp.toString(16)+": "+allt[bp]);
            bp++;
        }
    }
}