
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
        
    }
    
    if(address >= 0xFF80 && address <= 0FFFE){ // High RAM Area
        
    }
    
    if(address == 0xFFFF) interruptsDisabled = b==0?0:1;
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
        
    }
    
    if(address >= 0xFF80 && address <= 0FFFE){ // High RAM Area
        
    }
    
    if(address == 0xFFFF) bytetoreturn = interruptsDisabled?0:1;
    
    return bytetoreturn&0xFF;
}