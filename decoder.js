var decode = new Array(256);

var memory = new Array(0xFFFF);

var reg = new Array(4);

const A = 0;
const F = 1;

const B = 2;
const C = 3;

const D = 4;
const E = 6;

const H = 7;
const L = 8;

const AF = 0;
const BC = 1;
const DE = 2;
const HL = 3;

var SP = 0xFFFE;
var PC = 0x100;

reg[AF] = 0x01B0;
reg[BC] = 0x0013;
reg[DE] = 0x00D8;
reg[HL] = 0x014D;

var getByteRegVal = function(r1) {
    var r16 = Math.floor(r1 / 2);
    var hl = r1 % 2;
    var rb = reg[r16];
    var rh = (rb & 0xFF00)>>8;
    var rl = (rb & 0xFF);
    
    if(hl==0) return rh;
    else return rl;
}

var setByteRegVal = function(r1, val) {
    var r16 = Math.floor(r1 / 2);
    var hl = r1 % 2;
    var rb = reg[r16];
    var rh = (rb & 0xFF00)>>8;
    var rl = (rb & 0xFF);
    
    if(hl == 0) rh = val;
    else rl = val;
    
    reg[r16] = (rh << 8) | rl;
}

function LDRN(r1) {
    PC++;
    var immediate = memory[PC];
    PC++;
    setByteRegFrom(r1, immediate);
    return 8;
}

function LDRR(r1,r2){
    setByteRegVal(r1, getByteRegVal(r2));
    PC++;
    return 4;
}

function LDRD(r1, dr) {
    var addr = reg[dr];
    setByteRegVal(r1, memory[addr]);
    PC++;
    return 4;
}

function LDRAD(r1) {
    PC++;
    var n1 = memory[PC];
    PC++;
    var n2 = memory[PC];
    var fus = (n2 << 8) | n1;
    setByteRegVal(A, memory[fus]);
    return 16;
}

var LDWADR = function(w1, r1){
    memory[reg[w1]] = getByteRegVal(r1);
    PC++;
    return 8;
}

var LDIADR = function(r1) {
    PC++;
    var n1 = memory[PC];
    PC++;
    var n2 = memory[PC];
    var fus = (n2 << 8) | n1;
    setByteRegVal(r1, fus);
    return 16;
}

var LDWADI = function(w1){
    PC++;
    var num = memory[PC];
    PC++;
    memory[reg[w1]] = num;
    return 12;
}

decode[0x00] = function() { // NOP
    PC++;
    return 4;
}

// LD nn,n (n=immediate value)

decode[0x06] = function() { // LD B,n
    return LDRN(B);
}
decode[0x0E] = function() { // LD C,n
    return LDRN(C);
}
decode[0x16] = function() { // LD D,n
    return LDRN(D);
}
decode[0x1e] = function() { // LD E,n
    return LDRN(E);
}
decode[0x26] = function() { // LD H,n
    return LDRN(H);
}
decode[0x2e] = function() { // LD L,n
    return LDRN(L);
}

// LD r1,r2 put value in r1,r2

decode[0x7f] = function() { // LD A,A
    return LDRR(A, A);
}
decode[0x78] = function() { // LD A,B
    return LDRR(A, B);
}
decode[0x79] = function() { // LD A,C
    return LDRR(A, C);
}
decode[0x7A] = function() { // LD A,D
    return LDRR(A, D);
}
decode[0x7B] = function() { // LD A,E
    return LDRR(A, E);
}
decode[0x7C] = function() { // LD A,H
    return LDRR(A, H);
}
decode[0x7D] = function() { // LD A,L
    return LDRR(A, L);
}

decode[0x7E] = function() { // LD A,(HL)
    return LDRD(A, HL);
}
decode[0x0A] = function() { // LD A,(BC)
    return LDRD(A, BC);
}
decode[0x1A] = function() { // LD A,(DE)
    return LDRD(A, DE);
}
decode[0xFA] = function() { // LD A,(nn)
    return LDRAD(A);
}
decode[0x3E] = function() { // LD A,(#)
    return LDRN(A);
}

decode[0x02] = function() { // LD (BC),A
    return LWADR(BC, A);
}
decode[0x12] = function() { // LD (DE),A
    return LDWADR(DE, A);
}
decode[0x77] = function() { // LD (HL),A
    return LDWADR(HL, A);
}
decode[0xEA] = function() { // LD (nn),A
    return LDIADR(A);
}



decode[0x40] = function() { // LD B,B
    return LDRR(B,B);
}
decode[0x41] = function() { // LD B,C
    return LDRR(B,C);
}
decode[0x42] = function() { // LD B,D
    return LDRR(B,D);
}
decode[0x43] = function() { // LD B,E
    return LDRR(B,E);
}
decode[0x44] = function() { // LD B,H
    return LDRR(B,H);
}
decode[0x45] = function() { // LD B,L
    return LDRR(B,L);
}
decode[0x46] = function() { // LD B,(HL)
    return LDRD(B,HL);
}

decode[0x48] = function() { // LD C,B
    return LDRR(C,B);
}
decode[0x49] = function() { // LD C,C
    return LDRR(C,C);
}
decode[0x4A] = function() { // LD C,D
    return LDRR(C,D);
}
decode[0x4B] = function() { // LD C,E
    return LDRR(C,E);
}
decode[0x4C] = function() { // LD C,H
    return LDRR(C,H);
}
decode[0x4D] = function() { // LD C,L
    return LDRR(C,L);
}
decode[0x4E] = function() { // LD C,(HL)
    return LDRD(C,HL);
}

decode[0x50] = function() { // LD D,B
    return LDRR(D,B);
}
decode[0x51] = function() { // LD D,C
    return LDRR(D,C);
}
decode[0x52] = function() { // LD D,D
    return LDRR(D,D);
}
decode[0x53] = function() { // LD D,E
    return LDRR(D,E);
}
decode[0x54] = function() { // LD D,H
    return LDRR(D,H);
}
decode[0x55] = function() { // LD D,L
    return LDRR(D,L);
}
decode[0x56] = function() { // LD D,(HL)
    return LDRD(D,HL);
}

decode[0x58] = function() { // LD E,B
    return LDRR(E,B);
}
decode[0x59] = function() { // LD E,C
    return LDRR(E,C);
}
decode[0x5A] = function() { // LD E,D
    return LDRR(E,D);
}
decode[0x5B] = function() { // LD E,E
    return LDRR(E,E);
}
decode[0x5C] = function() { // LD E,H
    return LDRR(R,H);
}
decode[0x5D] = function() { // LD E,L
    return LDRR(E,L);
}
decode[0x5E] = function() { // LD E,(HL)
    return LDRD(E,HL);
}

decode[0x60] = function() { // LD H,B
    return LDRR(H,B);
}
decode[0x61] = function() { // LD H,C
    return LDRR(H,C);
}
decode[0x62] = function() { // LD H,D
    return LDRR(H,D);
}
decode[0x63] = function() { // LD H,E
    return LDRR(H,E);
}
decode[0x64] = function() { // LD H,H
    return LDRR(H,H);
}
decode[0x65] = function() { // LD H,L
    return LDRR(H,L);
}
decode[0x66] = function() { // LD H,(HL)
    return LDRD(H,HL);
}

decode[0x68] = function() { // LD L,B
    return LDRR(L,B);
}
decode[0x69] = function() { // LD L,C
    return LDRR(L,C);
}
decode[0x6A] = function() { // LD L,D
    return LDRR(L,D);
}
decode[0x6B] = function() { // LD L,E
    return LDRR(L,E);
}
decode[0x6C] = function() { // LD L,H
    return LDRR(L,H);
}
decode[0x6D] = function() { // LD L,L
    return LDRR(L,L);
}
decode[0x6E] = function() { // LD L,(HL)
    return LDRD(L,HL);
}

decode[0x70] = function() { // LD (HL),B
    return LDWADR(HL,B);
}
decode[0x71] = function() { // LD (HL),C
    return LDWADR(HL,C);
}
decode[0x72] = function() { // LD (HL),D
    return LDWADR(HL,D);
}
decode[0x73] = function() { // LD (HL),E
    retrun LDWADR(HL,E);
}
decode[0x74] = function() { // LD (HL),H
    return LDWADR(HL,H);
}
decode[0x75] = function() { // LD (HL),L
    return LDWADR(HL,L);
}
decode[0x36] = function() { // LD (HL),n
    return LDWADI(HL);
}