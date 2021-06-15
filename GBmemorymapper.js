
var gb_bios_rom = [0x31, 0xFE, 0xFF, 0xAF, 0x21, 0xFF, 0x9F, 0x32, 0xCB, 0x7C, 0x20, 0xFB, 0x21, 0x26, 0xFF, 0x0E, 
0x11, 0x3E, 0x80, 0x32, 0xE2, 0x0C, 0x3E, 0xF3, 0xE2, 0x32, 0x3E, 0x77, 0x77, 0x3E, 0xFC, 0xE0, 
0x47, 0x11, 0x04, 0x01, 0x21, 0x10, 0x80, 0x1A, 0xCD, 0x95, 0x00, 0xCD, 0x96, 0x00, 0x13, 0x7B, 
0xFE, 0x34, 0x20, 0xF3, 0x11, 0xD8, 0x00, 0x06, 0x08, 0x1A, 0x13, 0x22, 0x23, 0x05, 0x20, 0xF9, 
0x3E, 0x19, 0xEA, 0x10, 0x99, 0x21, 0x2F, 0x99, 0x0E, 0x0C, 0x3D, 0x28, 0x08, 0x32, 0x0D, 0x20, 
0xF9, 0x2E, 0x0F, 0x18, 0xF3, 0x67, 0x3E, 0x64, 0x57, 0xE0, 0x42, 0x3E, 0x91, 0xE0, 0x40, 0x04, 
0x1E, 0x02, 0x0E, 0x0C, 0xF0, 0x44, 0xFE, 0x90, 0x20, 0xFA, 0x0D, 0x20, 0xF7, 0x1D, 0x20, 0xF2, 
0x0E, 0x13, 0x24, 0x7C, 0x1E, 0x83, 0xFE, 0x62, 0x28, 0x06, 0x1E, 0xC1, 0xFE, 0x64, 0x20, 0x06, 
0x7B, 0xE2, 0x0C, 0x3E, 0x87, 0xE2, 0xF0, 0x42, 0x90, 0xE0, 0x42, 0x15, 0x20, 0xD2, 0x05, 0x20, 
0x4F, 0x16, 0x20, 0x18, 0xCB, 0x4F, 0x06, 0x04, 0xC5, 0xCB, 0x11, 0x17, 0xC1, 0xCB, 0x11, 0x17, 
0x05, 0x20, 0xF5, 0x22, 0x23, 0x22, 0x23, 0xC9, 0xCE, 0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B, 
0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D, 0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E, 
0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99, 0xBB, 0xBB, 0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC, 
0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E, 0x3C, 0x42, 0xB9, 0xA5, 0xB9, 0xA5, 0x42, 0x3C, 
0x21, 0x04, 0x01, 0x11, 0xA8, 0x00, 0x1A, 0x13, 0xBE, 0x20, 0xFE, 0x23, 0x7D, 0xFE, 0x34, 0x20, 
0xF5, 0x06, 0x19, 0x78, 0x86, 0x23, 0x05, 0x20, 0xFB, 0x86, 0x20, 0xFE, 0x3E, 0x01, 0xE0, 0x50];

var rom_bank0 = [];
var rom_bankx = [];
var char_ram = [];
var hardware_io = new Uint8Array(127);

// Screen|CPU Register
var SCY = 0; // 0xFF42
var SCX = 0; // 0xFF43
var LY = 0; // 0xFF44
var LYC = 0; // 0xFF45
var DMA = 0; // 0xFF46
var BGP = 0; // 0xFF47
var OBP0 = 0; // 0xFF48
var OBP1 = 0; // 0xFF49
var SB = 0; // 0xFF01
var SC = 0; // 0xFF02
var DIV = 0; // 0xFF04
var TIMA = 0; // 0xFF05
var TMA = 0; // 0xFF06
var TAC = 0; // 0xFF07
var WY = 0; // 0xFF4A
var WX = 0; // 0xFF4B


// Audio Register
var NR10 = 0; // 0xFF10
var NR11 = 0; // 0xFF11
var NR12 = 0; // 0xFF12
var NR13 = 0; // 0xFF13
var NR14 = 0; // 0xFF14
var NR21 = 0; // 0xFF16
var NR22 = 0; // 0xFF17
var NR23 = 0; // 0xFF18
var NR24 = 0; // 0xFF19 
var NR30 = 0; // 0xFF1A
var NR31 = 0; // 0xFF1B
var NR32 = 0 // 0xFF1C
var NR33 = 0; // 0xFF1D
var NR34 = 0; // 0xFF1E
var NR41 = 0; // 0xFF20
var NR42 = 0; // 0xFF21
var NR42_2 = 0; // 0xFF22
var NR43 = 0; // 0xFF23
var NR50 = 0; // 0xFF24
var NR51 = 0; // 0xFF26
var NR52 = 0; // 0xFF25




var InterruptRegister = 0; // 0xFFFF


/*
  00001  =  VBlank
  00010  =  STAT
  00100  =  Timer
  01000  =  Serial
  10000  =  JoyPad
*/

function writeMem(address, b){
    if(address >= 0x0000 && address <= 0x00FF){ // BIOS rom
        // Do Nothing
    }
    
    if(address >= 0x0100 && address <= 0x014F){ // Cartrige header
        // Do Nothing
    }
    
    if(address >= 0x0150 && address <= 0x3FFF){ // ROM Bank 0
        // Do Nothing
    }
    if(address >= 0x4000 && address <= 0x7FFF){ // ROM Bank u
        // Do Nothing
    }
    
    if(address >= 0x8000 && address <= 0x97FF){ // Character RAM
        
    }
    
    if(address >= 0x9800 && address <= 0x9BFF){ // BG Map Data 1
        
    }
    
    if(address >= 0x9C00 && address <= 0x9FFF){ // BG Map Data 2
        
    }
    
    if(address >= 0xA000 && address <= 0xBFFF){ // External cartrige ram
        
    }
    
    if(address >= 0xC000 && address <= 0xDFFF){ // Internal Work RAM
        
    }
    
    if(address >= 0xE000 && address <= 0xFDFF){ // Reserved Area/Echo RAM
        writeMem(address - 0xE000 + 0xC000, b);
    }
    
    if(address >= 0xFE00 && address <= 0xFE9F){ // Object Attribute Memory (OAM)
        
    }
    
    if(address >= 0xFEA0 && address <= 0xFEFF){ // Unused
        
    }
    
    if(address >= 0xFF00 && address <= 0xFF7F){ // Hardware I/O Registers
        switch(address){
            case 0xFF42: SCY = b; break; // Screen | CPU
            case 0xFF43: SCX = b; break;
            case 0xFF44: LY = b; break;
            case 0xFF45: LYC = b; break;
            case 0xFF46: DMA = b; break;
            case 0xFF47: BGP = b; break;
            case 0xFF48: OBP0 = b; break;
            case 0xFF49: OBP1 = b; break;
            case 0xFF01: SB = b; break;
            case 0xFF02: SC = b; break;
            case 0xFF04: DIV = b; break;
            case 0xFF05: TIMA = b; break;
            case 0xFF06: TMA = b; break;
            case 0xFF07: TAC = b; break;
            case 0xFF4A: WY = b; break;
            case 0xFF4B: WX = b; break;
            case 0xFF10: NR10 = b; break; // Audio
            case 0xFF11: NR11 = b; break; // 0xFF11
            case 0xFF12: NR12 = b; break; // 0xFF12
            case 0xFF13: NR13 = b; break; // 0xFF13
            case 0xFF14: NR14 = b; break; // 0xFF14
            case 0xFF16: NR21 = b; break; // 0xFF16
            case 0xFF17: NR22 = b; break; // 0xFF17
            case 0xFF18: NR23 = b; break; // 0xFF18
            case 0xFF19: NR24 = b; break; // 0xFF19 
            case 0xFF1A: NR30 = b; break; // 0xFF1A
            case 0xFF1B: NR31 = b; break; // 0xFF1B
            case 0xFF1C: NR32 = b  break;// 0xFF1C
            case 0xFF1D: NR33 = b; break; // 0xFF1D
            case 0xFF1E: NR34 = b; break; // 0xFF1E
            case 0xFF20: NR41 = b; break; // 0xFF20
            case 0xFF21: NR42 = b; break; // 0xFF21
            case 0xFF22: NR42_2 = b; break; // 0xFF22
            case 0xFF23: NR43 = b; break; // 0xFF23
            case 0xFF24: NR50 = b; break; // 0xFF24
            case 0xFF26: NR51 = b; break; // 0xFF26
            case 0xFF25: NR52 = b; break; // 0xFF25
        }
    }
    
    if(address >= 0xFF80 && address <= 0FFFE){ // High RAM Area
        
    }
    
    if(address == 0xFFFF) InterruptRegister = b;
}

function readMem(address){
    var bytetoreturn = 0;
    
    if(address >= 0x0000 && address <= 0x00FF){ // BIOS rom
        bytetoreturn = gb_bios_rom[address];
    }
    
    if(address >= 0x0100 && address <= 0x014F){ // Cartrige header
        
    }
    
    if(address >= 0x0150 && address <= 0x3FFF){ // ROM Bank 0
        
    }
    if(address >= 0x4000 && address <= 0x7FFF){ // ROM Bank u
        
    }
    
    if(address >= 0x8000 && address <= 0x97FF){ // Character RAM
        
    }
    
    if(address >= 0x9800 && address <= 0x9BFF){ // BG Map Data 1
        
    }
    
    if(address >= 0x9C00 && address <= 0x9FFF){ // BG Map Data 2
        
    }
    
    if(address >= 0xA000 && address <= 0xBFFF){ // External cartrige ram
        
    }
    
    if(address >= 0xC000 && address <= 0xDFFF){ // Internal Work RAM
        
    }
    
    if(address >= 0xE000 && address <= 0xFDFF){ // Reserved Area/Echo RAM
        bytetoreturn = readMem(address - 0xE000 + 0xC000);
    }
    
    if(address >= 0xFE00 && address <= 0xFE9F){ // Object Attribute Memory (OAM)
        
    }
    
    if(address >= 0xFEA0 && address <= 0xFEFF){ // Unused
        
    }
    
    if(address >= 0xFF00 && address <= 0xFF7F){ // Hardware I/O Registers
        if(adress == 0xFF0F) {
            bytetoreturn = interruptsDisabled?1:0;
        }
        
        if(address == 0xFF24) // AUDVOL
        {
        }
        
    }
    
    if(address >= 0xFF80 && address <= 0FFFE){ // High RAM Area
        
    }
    
    if(address == 0xFFFF) bytetoreturn = InterruptRegister;
    
    return bytetoreturn&0xFF;
}