
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

var PAD   = 0; 
var LCDC  = 0; 
var STAT  = 0; 
var BCPD  = 0; // CGB Mode Only
var OCPD  = 0; // CGB Mode Only
var SCX   = 0; 
var SCY   = 0; 
var LY    = 0; 
var LYC   = 0; 
var WY    = 0; 
var WX    = 0; 
var BGP   = 0; // Non CGB Mode Only
var OBP0  = 0; // Non CGB Mode Only
var OBP1  = 0; // Non CGB Mode Only
var BCPS  = 0; // CGB Mode Only
var OCPS  = 0; // CGB Mode Only
var VBK   = 0; // CGB Mode Only
var DMA   = 0; 
var HDMA1 = 0; // CGB Mode Only
var HDMA2 = 0; // CGB Mode Only
var HDMA3 = 0; // CGB Mode Only
var HDMA4 = 0; // CGB Mode Only
var HDMA5 = 0; // CGB Mode Only
var NR10  = 0; 
var NR11  = 0; 
var NR12  = 0; 
var NR13  = 0; 
var NR14  = 0; 
var NR21  = 0; 
var NR22  = 0; 
var NR23  = 0; 
var NR24  = 0; 
var NR30  = 0; 
var NR31  = 0; 
var NR32  = 0; 
var NR33  = 0; 
var NR34  = 0; 
var NR41  = 0; 
var NR42  = 0; 
var NR43  = 0; 
var NR44  = 0; 
var NR50  = 0; 
var NR51  = 0; 
var NR52  = 0; 
var SB    = 0; 
var SC    = 0; 
var IF    = 0; 
var DIV   = 0; 
var TIMA  = 0; 
var TAC   = 0; 
var TMA   = 0; 
var KEY1  = 0; // CGB Mode Only
var RP    = 0; // CGB Mode Only
var SVBK  = 0; // CGB Mode Only
var IR    = 0;


var wav_ram = new Uint8Array(16);

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
        case 0xFF00: PAD   = b;  break; // JoyPad
        case 0xFF40: LCDC  = b;  break; // LCD Control Register
        case 0xFF41: STAT  = b;  break; // LCD Control Status
        case 0xFF69: BCPD  = b;  break; // BCPD/BGPD - CGB Mode Only - Background Palette Data
        case 0xFF6B: OCPD  = b;  break; // OCPD/OBPD - CGB Mode Only - Sprite Palette Data
        case 0xFF43: SCX   = b;  break; // SCX - Scroll X (R/W)
        case 0xFF42: SCY   = b;  break; // SCY - Scroll Y (R/W)
        case 0xFF44: LY    = b;  break; // LY - LCDC Y-Coordinate (R)
        case 0xFF45: LYC   = b;  break; // LYC - LY Compare (R/W)
        case 0xFF4A: WY    = b;  break; // WY - Window Y Position (R/W)
        case 0xFF4B: WX    = b;  break; // WX - Window X Position minus 7 (R/W)
        case 0xFF47: BGP   = b;  break; // BGP - BG Palette Data (R/W) - Non CGB Mode Only
        case 0xFF48: OBP0  = b;  break; // OBP0 - Object Palette 0 Data (R/W) - Non CGB Mode Only
        case 0xFF49: OBP1  = b;  break; // OBP1 - Object Palette 1 Data (R/W) - Non CGB Mode Only
        case 0xFF68: BCPS  = b;  break; // BCPS/BGPI - CGB Mode Only - Background Palette Index
        case 0xFF6A: OCPS  = b;  break; // OCPS/OBPI - CGB Mode Only - Sprite Palette Index
        case 0xFF4F: VBK   = b;  break; // VBK - CGB Mode Only - VRAM Bank
        case 0xFF46: DMA   = b;  break; // DMA - DMA Transfer and Start Address (W)
        case 0xFF51: HDMA1 = b;  break; // HDMA1 - CGB Mode Only - New DMA Source, High
        case 0xFF52: HDMA2 = b;  break; // HDMA2 - CGB Mode Only - New DMA Source, Low
        case 0xFF53: HDMA3 = b;  break; // HDMA3 - CGB Mode Only - New DMA Destination, High
        case 0xFF54: HDMA4 = b;  break; // HDMA4 - CGB Mode Only - New DMA Destination, Low
        case 0xFF55: HDMA5 = b;  break; // HDMA5 - CGB Mode Only - New DMA Length/Mode/Start
        case 0xFF10: NR10  = b;  break; // NR10 - Channel 1 Sweep register (R/W)
        case 0xFF11: NR11  = b;  break; // NR11 - Channel 1 Sound length/Wave pattern duty (R/W)
        case 0xFF12: NR12  = b;  break; // NR12 - Channel 1 Volume Envelope (R/W)
        case 0xFF13: NR13  = b;  break; // NR13 - Channel 1 Frequency lo (Write Only)
        case 0xFF14: NR14  = b;  break; // NR14 - Channel 1 Frequency hi (R/W)
        case 0xFF16: NR21  = b;  break; // NR21 - Channel 2 Sound Length/Wave Pattern Duty (R/W)
        case 0xFF17: NR22  = b;  break; // NR22 - Channel 2 Volume Envelope (R/W)
        case 0xFF18: NR23  = b;  break; // NR23 - Channel 2 Frequency lo data (W)
        case 0xFF19: NR24  = b;  break; // NR24 - Channel 2 Frequency hi data (R/W)
        case 0xFF1A: NR30  = b;  break; // NR30 - Channel 3 Sound on/off (R/W)
        case 0xFF1B: NR31  = b;  break; // NR31 - Channel 3 Sound Length
        case 0xFF1C: NR32  = b;  break; // NR32 - Channel 3 Select output level (R/W)
        case 0xFF1D: NR33  = b;  break; // NR33 - Channel 3 Frequency's lower data (W)
        case 0xFF1E: NR34  = b;  break; // NR34 - Channel 3 Frequency's higher data (R/W)
        case 0xFF20: NR41  = b;  break; // NR41 - Channel 4 Sound Length (R/W)
        case 0xFF21: NR42  = b;  break; // NR42 - Channel 4 Volume Envelope (R/W)
        case 0xFF22: NR43  = b;  break; // NR43 - Channel 4 Polynomial Counter (R/W)
        case 0xFF23: NR44  = b;  break; // NR44 - Channel 4 Counter/consecutive; Inital (R/W)
        case 0xFF24: NR50  = b;  break; // NR50 - Channel control / ON-OFF / Volume (R/W)
        case 0xFF25: NR51  = b;  break; // NR51 - Selection of Sound output terminal (R/W)
        case 0xFF26: NR52  = b;  break; // NR52 - Sound on/off
        case 0xFF01: SB    = b;  break; // SB - Serial transfer data (R/W)
        case 0xFF02: SC    = b;  break; // SC - Serial Transfer Control (R/W)
        case 0xFF0F: IF    = b;  break; // IF Register
        case 0xFF04: DIV   = b;  break; // DIV - Divider Register (R/W)
        case 0xFF05: TIMA  = b;  break; // TIMA - Timer counter (R/W)
        case 0xFF07: TAC   = b;  break; // TAC - Timer Control (R/W)
        case 0xFF06: TMA   = b;  break; // TMA - Timer Modulo (R/W)
        case 0xFF4D: KEY1  = b; break; // KEY1 - CGB Mode Only - Prepare Speed Switch
        case 0xFF56: RP    = b; break; // RP - CGB Mode Only - Infrared Communications Port
        case 0xFF70: SVBK  = b; break; // SVBK - CGB Mode Only - WRAM Bank
        case 0xFF6C:   break; // Undocumented (FEh) - Bit 0 (Read/Write) - CGB Mode Only
        case 0xFF72:   break; // Undocumented (00h) - Bit 0-7 (Read/Write)
        case 0xFF73:   break; // Undocumented (00h) - Bit 0-7 (Read/Write)
        case 0xFF74:   break; // Undocumented (00h) - Bit 0-7 (Read/Write) - CGB Mode Only
        case 0xFF75:   break; // Undocumented (8Fh) - Bit 4-6 (Read/Write)
        case 0xFF76:   break; // Undocumented (00h) - Always 00h (Read Only)
        case 0xFF77:   break; // Undocumented (00h) - Always 00h (Read Only)
        default: 
            if(address >= 0xFF30 && address <= 0xFF3F){
                wav_ram[address - 0xFF30] = b;
            }
            break;
      }
    }
    
    if(address >= 0xFF80 && address <= 0FFFE){ // High RAM Area
        
    }
    
    if(address == 0xFFFF) IR = b;
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
        switch(address){
          case 0xFF00: bytetoreturn =  PAD;    break; // JoyPad
          case 0xFF40: bytetoreturn =  LCDC;   break; // LCD Control Register
          case 0xFF41: bytetoreturn =  STAT;   break; // LCD Control Status
          case 0xFF69: bytetoreturn =  BCPD;   break; // BCPD/BGPD - CGB Mode Only - Background Palette Data
          case 0xFF6B: bytetoreturn =  OCPD;   break; // OCPD/OBPD - CGB Mode Only - Sprite Palette Data
          case 0xFF43: bytetoreturn =  SCX;    break; // SCX - Scroll X (R/W)
          case 0xFF42: bytetoreturn =  SCY;    break; // SCY - Scroll Y (R/W)
          case 0xFF44: bytetoreturn =  LY;     break; // LY - LCDC Y-Coordinate (R)
          case 0xFF45: bytetoreturn =  LYC;    break; // LYC - LY Compare (R/W)
          case 0xFF4A: bytetoreturn =  WY;     break; // WY - Window Y Position (R/W)
          case 0xFF4B: bytetoreturn =  WX;     break; // WX - Window X Position minus 7 (R/W)
          case 0xFF47: bytetoreturn =  BGP;    break; // BGP - BG Palette Data (R/W) - Non CGB Mode Only
          case 0xFF48: bytetoreturn =  OBP0;   break; // OBP0 - Object Palette 0 Data (R/W) - Non CGB Mode Only
          case 0xFF49: bytetoreturn =  OBP1;   break; // OBP1 - Object Palette 1 Data (R/W) - Non CGB Mode Only
          case 0xFF68: bytetoreturn =  BCPS;   break; // BCPS/BGPI - CGB Mode Only - Background Palette Index
          case 0xFF6A: bytetoreturn =  OCPS;   break; // OCPS/OBPI - CGB Mode Only - Sprite Palette Index
          case 0xFF4F: bytetoreturn =  VBK;    break; // VBK - CGB Mode Only - VRAM Bank
          case 0xFF46: bytetoreturn =  DMA;    break; // DMA - DMA Transfer and Start Address (W)
          case 0xFF51: bytetoreturn =  HDMA1;  break; // HDMA1 - CGB Mode Only - New DMA Source, High
          case 0xFF52: bytetoreturn =  HDMA2;  break; // HDMA2 - CGB Mode Only - New DMA Source, Low
          case 0xFF53: bytetoreturn =  HDMA3;  break; // HDMA3 - CGB Mode Only - New DMA Destination, High
          case 0xFF54: bytetoreturn =  HDMA4;  break; // HDMA4 - CGB Mode Only - New DMA Destination, Low
          case 0xFF55: bytetoreturn =  HDMA5;  break; // HDMA5 - CGB Mode Only - New DMA Length/Mode/Start
          case 0xFF10: bytetoreturn =  NR10;   break; // NR10 - Channel 1 Sweep register (R/W)
          case 0xFF11: bytetoreturn =  NR11;   break; // NR11 - Channel 1 Sound length/Wave pattern duty (R/W)
          case 0xFF12: bytetoreturn =  NR12;   break; // NR12 - Channel 1 Volume Envelope (R/W)
          case 0xFF13: bytetoreturn =  NR13;   break; // NR13 - Channel 1 Frequency lo (Write Only)
          case 0xFF14: bytetoreturn =  NR14;   break; // NR14 - Channel 1 Frequency hi (R/W)
          case 0xFF16: bytetoreturn =  NR21;   break; // NR21 - Channel 2 Sound Length/Wave Pattern Duty (R/W)
          case 0xFF17: bytetoreturn =  NR22;   break; // NR22 - Channel 2 Volume Envelope (R/W)
          case 0xFF18: bytetoreturn =  NR23;   break; // NR23 - Channel 2 Frequency lo data (W)
          case 0xFF19: bytetoreturn =  NR24;   break; // NR24 - Channel 2 Frequency hi data (R/W)
          case 0xFF1A: bytetoreturn =  NR30;   break; // NR30 - Channel 3 Sound on/off (R/W)
          case 0xFF1B: bytetoreturn =  NR31;   break; // NR31 - Channel 3 Sound Length
          case 0xFF1C: bytetoreturn =  NR32;   break; // NR32 - Channel 3 Select output level (R/W)
          case 0xFF1D: bytetoreturn =  NR33;   break; // NR33 - Channel 3 Frequency's lower data (W)
          case 0xFF1E: bytetoreturn =  NR34;   break; // NR34 - Channel 3 Frequency's higher data (R/W)
          case 0xFF20: bytetoreturn =  NR41;   break; // NR41 - Channel 4 Sound Length (R/W)
          case 0xFF21: bytetoreturn =  NR42;   break; // NR42 - Channel 4 Volume Envelope (R/W)
          case 0xFF22: bytetoreturn =  NR43;   break; // NR43 - Channel 4 Polynomial Counter (R/W)
          case 0xFF23: bytetoreturn =  NR44;   break; // NR44 - Channel 4 Counter/consecutive; Inital (R/W)
          case 0xFF24: bytetoreturn =  NR50;   break; // NR50 - Channel control / ON-OFF / Volume (R/W)
          case 0xFF25: bytetoreturn =  NR51;   break; // NR51 - Selection of Sound output terminal (R/W)
          case 0xFF26: bytetoreturn =  NR52;   break; // NR52 - Sound on/off
          case 0xFF01: bytetoreturn =  SB;     break; // SB - Serial transfer data (R/W)
          case 0xFF02: bytetoreturn =  SC;     break; // SC - Serial Transfer Control (R/W)
          case 0xFF0F: bytetoreturn =  IF;     break; // IF Register
          case 0xFF04: bytetoreturn =  DIV;    break; // DIV - Divider Register (R/W)
          case 0xFF05: bytetoreturn =  TIMA;   break; // TIMA - Timer counter (R/W)
          case 0xFF07: bytetoreturn =  TAC;    break; // TAC - Timer Control (R/W)
          case 0xFF06: bytetoreturn =  TMA;    break; // TMA - Timer Modulo (R/W)
          case 0xFF4D: bytetoreturn =  KEY1;   break; // KEY1 - CGB Mode Only - Prepare Speed Switch
          case 0xFF56: bytetoreturn =  RP;     break; // RP - CGB Mode Only - Infrared Communications Port
          case 0xFF70: bytetoreturn =  SVBK;   break; // SVBK - CGB Mode Only - WRAM Bank
          case 0xFF6C:    break; // Undocumented (FEh) - Bit 0 (Read/Write) - CGB Mode Only
          case 0xFF72:    break; // Undocumented (00h) - Bit 0-7 (Read/Write)
          case 0xFF73:    break; // Undocumented (00h) - Bit 0-7 (Read/Write)
          case 0xFF74:    break; // Undocumented (00h) - Bit 0-7 (Read/Write) - CGB Mode Only
          case 0xFF75:    break; // Undocumented (8Fh) - Bit 4-6 (Read/Write)
          case 0xFF76:    break; // Undocumented (00h) - Always 00h (Read Only)
          case 0xFF77:    break; // Undocumented (00h) - Always 00h (Read Only)
           default: 
            if(address >= 0xFF30 && address <= 0xFF3F){
                bytetoreturn = wav_ram[address - 0xFF30];
            }
            else {
                bytetoreturn = wav_ram[address - 0xFF30];
            }
            break;
        }
        
        if(address >= 0xFF30 && address <= 0xFF3F){
        }
    }
    
    if(address >= 0xFF80 && address <= 0FFFE){ // High RAM Area
        
    }
    
    if(address == 0xFFFF) bytetoreturn = IR;
    
    return bytetoreturn&0xFF;
}