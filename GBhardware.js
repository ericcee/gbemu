// PAD
const JOY_RIGHT = 0x11;
const JOY_LEFT = 0x12;
const JOY_UP = 0x14;
const JOY_DOWN = 0x18;
const JOY_A = 0x21;
const JOY_B = 0x22;
const JOY_SELECT = 0x24;
const JOY_START = 0x28;


// Interrupt Flag
const IF_VBlank = 0x01;
const IF_LCDC = 0x02;
const IF_TimerOverflow = 0x04;
const IF_SeriIOComplete = 0x08;
const IF_TrPinJoyPad = 0x10;

// GameBoy Interrupt Adresses
const INT_VBlank = 0x0040;
const INT_LCDC = 0x0048;
const INT_TimerOverflow = 0x0050;
const INT_SeriIOComplete = 0x0058;
const INT_TrPinJoyPad = 0x0060;

// LCDC Bits  
const LCD_Enable = 0b10000000; // Bit 7 - LCD Display Enable             (0=Off, 1=On)
const TileMapDisplayLesect = 0b01000000; // Bit 6 - Window Tile Map Display Select (0=9800-9BFF, 1=9C00-9FFF)
const WindowDisplayEnable = 0b00100000; // Bit 5 - Window Display Enable          (0=Off, 1=On)
const BGWindowTile = 0b00010000; // Bit 4 - BG & Window Tile Data Select   (0=8800-97FF, 1=8000-8FFF)
const BGTileMapDIsplay = 0b00001000; // Bit 3 - BG Tile Map Display Select     (0=9800-9BFF, 1=9C00-9FFF)
const SpriteSize = 0b00000100; // Bit 2 - OBJ (Sprite) Size              (0=8x8, 1=8x16)
const SpriteDisplayEnable = 0b00000010; // Bit 1 - OBJ (Sprite) Display Enable    (0=Off, 1=On)
const BGDisplay = 0b00000001; // Bit 0 - BG Display (for CGB see below) (0=Off, 1=On)

var scrCycl = 0;
var LCD_lastmode = 0;

const GB_HEIGHT = 144;
const GB_WIDTH = 160;
const GB_VBLANK = 9;

const GB_SCREEN_MODE0 = 201;
const GB_SCREEN_MODE2 = 80;
const GB_SCREEN_MODE3 = 169;
const GB_CYCLE_COMPLETE = 456;

var dpixels = new Uint8Array(160*144);

function triggerInterrupt(int){
    gb_push(PC);
    reg[PC] = int;
    IME = false;
    return 20;
}

const pixelDecoder=[]
for (var d1 = 0; d1<256; d1++) {
    pixelDecoder[d1]=[]
    for (var d2 = 0; d2<256; d2++)
        pixelDecoder[d1][d2] = [
            ((d1&128)+ 2*(d2&128)) >>7,
            ((d1&64) + 2*(d2&64)) >>6,
            ((d1&32) + 2*(d2&32)) >>5,
            ((d1&16) + 2*(d2&16)) >>4,
            ((d1&8)  + 2*(d2&8)) >>3,
            ((d1&4)  + 2*(d2&4)) >>2,
            ((d1&2)  + 2*(d2&2)) >>1,
            ((d1&1)  + 2*(d2&1))
        ]
}

function ScreenCycle(prevCycles) {
    var cycles = 0;
    if(LCDC & LCD_Enable){
        scrCycl += prevCycles;

        let mode = 0, coincidence = false, draw = false;
        if (scrCycl <= 80) mode = 2
        else if (scrCycl <= 252) mode = 3
        else if (scrCycl < GB_CYCLE_COMPLETE) {
            draw = (LCD_lastmode!=0)
            mode = 0
        } else {
            mode = 2
            scrCycl -= GB_CYCLE_COMPLETE;
            LY ++;
            if (LY > GB_HEIGHT + GB_VBLANK) LY =0;
            coincidence = (LY == LYC);
        }

        if (LY >= GB_HEIGHT) mode = 1; //vblank
        else if (draw){
            //Draw scanline
            var dpy = LY*160;

            var drawWindow = (LCDC & (1<<5)) && LY >= WY;
            var bgStopX = drawWindow ? WX-7 : 160;

            //  FF40 - LCDC - LCD Control (R/W)
            //
            //  Bit 7 - LCD Display Enable             (0=Off, 1=On)
            //  Bit 6 - Window Tile Map Display Select (0=9800-9BFF, 1=9C00-9FFF)
            //  Bit 5 - Window Display Enable          (0=Off, 1=On)
            //  Bit 4 - BG & Window Tile Data Select   (0=8800-97FF, 1=8000-8FFF)
            //  Bit 3 - BG Tile Map Display Select     (0=9800-9BFF, 1=9C00-9FFF)
            //  Bit 2 - OBJ (Sprite) Size              (0=8x8, 1=8x16)
            //  Bit 1 - OBJ (Sprite) Display Enable    (0=Off, 1=On)
            //  Bit 0 - BG Display (for CGB see below) (0=Off, 1=On)

            var baseTileOffset, tileSigned;
            // Tile Data Select
            if (LCDC&(1<<4)) {
                baseTileOffset =  0x8000;
                tileSigned = false;
            } else {
                baseTileOffset =  0x9000;
                tileSigned = true;
            }
            var bgpalette = [
                (BGP)&3,
                (BGP>>2)&3,
                (BGP>>4)&3,
                (BGP>>6)&3
            ]

            function grabTile(n, offset){
                if (tileSigned && n >127){
                    var tileptr = offset+(n-256)*16;
                }else{
                    var tileptr = offset+n*16;
                }
                var d1 = readMem(tileptr), d2 = readMem(tileptr +1)
                return pixelDecoder[d1][d2]
            }

            if ( LCDC & 1 ) { // BG enabled
                // BG Tile map display select
                var bgTileMapAddr = LCDC&(1<<3) ? 0x9C00 : 0x9800;

                //scy FF42
                //scx FF43
                // scanline number FF44
                // pixel row = FF44 + FF42
                // tile row = pixel row >> 3
                // 32 bytes per row
                // pixel column = FF43
                // tile column = pixel column >> 3

                var x    = SCX >>3;
                var xoff = SCX & 7;
                var y = (LY + SCY) &0xFF;

                // Y doesn't change throughout a scanline
                bgTileMapAddr += (~~(y/8))*32;
                var tileOffset=baseTileOffset+(y&7)*2;

                var pix = grabTile(readMem(bgTileMapAddr + x), tileOffset);

                for (var i=0;i<bgStopX;i++) {
                    dpixels[dpy + i] = bgpalette[pix[ xoff++ ]]

                    if (xoff==8) {
                        x = (x+1)&0x1F; //wrap horizontally in tile map

                        pix = grabTile(readMem(bgTileMapAddr + x), tileOffset);
                        xoff=0;
                    }

                }
            }

            // FF4A - WY
            // FF4B - WX

            if ( drawWindow ) { // Window display enable
                // Window Tile map display select
                var wdTileMapAddr = LCDC&(1<<6) ? 0x9C00 : 0x9800;

                var xoff=0;
                var y=LY-WY;

                wdTileMapAddr += (~~(y/8))*32;
                var tileOffset=baseTileOffset+(y&7)*2;

                pix = grabTile(readMem( wdTileMapAddr ), tileOffset);

                for (var i=Math.max(0,bgStopX);i<160;i++) {
                    dpixels[dpy + i] = bgpalette[pix[ xoff++ ]]
                    if (xoff==8) {
                        pix = grabTile(readMem(++wdTileMapAddr), tileOffset);
                        xoff=0;
                    }
                }

            }

            if ( LCDC & 2 ) { // Sprite display enabled

                // Render sprites
                var height, tileNumMask;
                if (LCDC&(1<<2)) {
                    height=16;
                    tileNumMask=0xFE; // in 8x16 mode, lowest bit of tile number is ignored
                } else {
                    height=8;
                    tileNumMask=0xFF;
                }

                var OBP0 = [
                        0,
                        (OBP0>>2)&3,
                        (OBP0>>4)&3,
                        (OBP0>>6)&3
                    ],
                    OBP1 = [
                        0,
                        (OBP1>>2)&3,
                        (OBP1>>4)&3,
                        (OBP1>>6)&3
                    ],
                    background=bgpalette[0];

                // OAM 4 bytes per sprite, 40 sprites
                for (var i=0xFE9C;i>=0xFE00;i-=4) {
                    var ypos = readMem(i)-16+height;
                    if ( LY >= ypos-height && LY < ypos) {

                        var tileNum = 0x8000 + (readMem(i+2)&tileNumMask)*16,
                            xpos = readMem(i+1),
                            att = readMem(i+3);

                        // Bit7   OBJ-to-BG Priority (0=OBJ Above BG, 1=OBJ Behind BG color 1-3)
                        //        (Used for both BG and Window. BG color 0 is always behind OBJ)
                        // Bit6   Y flip          (0=Normal, 1=Vertically mirrored)
                        // Bit5   X flip          (0=Normal, 1=Horizontally mirrored)
                        // Bit4   Palette number  **Non CGB Mode Only** (0=OBP0, 1=OBP1)

                        var palette = att&(1<<4) ? OBP1 : OBP0 ;
                        var behind = att&(1<<7);

                        if (att&(1<<6)) { // Y flip
                            tileNum += (ypos-LY-1)*2
                        }else{
                            tileNum += (LY-ypos+height)*2
                        }
                        var d1= readMem(tileNum), d2= readMem(tileNum+1),
                            row = pixelDecoder[d1][d2];

                        if (att&(1<<5)) { // x flip
                            if (behind) {
                                for (var j = 0; j<Math.min(xpos,8); j++) {
                                    if (dpixels[dpy + xpos -1 - j] == background && row[j])
                                        dpixels[dpy + xpos -1 - j] = palette[row[ j ]];
                                }
                            }else{
                                for (var j = 0; j<Math.min(xpos,8); j++) {
                                    if (row[ j ]) dpixels[dpy + xpos -(j+1)] = palette[row[ j ]];
                                }
                            }
                        } else {
                            if (behind) {
                                for (var j = Math.max(8-xpos,0); j<8; j++) {
                                    if (dpixels[dpy + xpos -8 + j] == background && row[j])
                                        dpixels[dpy + xpos -8 + j] = palette[row[ j ]];
                                }
                            } else {
                                for (var j = Math.max(8-xpos,0); j<8; j++) {
                                    if (row[ j ]) dpixels[dpy + xpos -8 + j] = palette[row[ j ]];
                                }
                            }
                        }

                    }
                }

            }

        }

        if (coincidence){
            if (STAT & (1<<6)) { //coincidence interrupt enabled
                IF |= 1<<1; // LCD STAT Interrupt flag
                STAT |= 1<<2; // coincidence flag
            }
        } else STAT &= 0xFB//~(1<<2)
        if (LCD_lastmode!=mode) { //Mode change
            if (mode == 0) {
                if (STAT & (1<<3)) IF|= 1<<1;
            } else if (mode == 1) {

                // LCD STAT interrupt on v-blank
                if (STAT & (1<<4)) IF |= 1<<1;

                // Main V-Blank interrupt
                if (IR & 1) IF |= 1<<0;

                //renderDisplayCanvas();

            } else if (mode == 2){
                if (STAT & (1<<5)) IF |= 1<<1;
            }

            STAT &= 0xF8;
            STAT += mode;
            LCD_lastmode=mode;
        }

        // Interrupts
        // FFFF - IE - Interrupt Enable (R/W)
        // FF0F - IF - Interrupt Flag (R/W)
        // Bit 0: V-Blank  Interrupt Enable  (INT 40h)  (1=Enable)
        // Bit 1: LCD STAT Interrupt Enable  (INT 48h)  (1=Enable)
        // Bit 2: Timer    Interrupt Enable  (INT 50h)  (1=Enable)
        // Bit 3: Serial   Interrupt Enable  (INT 58h)  (1=Enable)
        // Bit 4: Joypad   Interrupt Enable  (INT 60h)  (1=Enable)

        if (IME) {
            // if enabled and flag set
            var i = IF & IR;

            if ( i&(1<<0) ) {
                IF &=~(1<<0)
                cycles += triggerInterrupt(0x40)
            } else if ( i&(1<<1) ) {
                IF &=~(1<<1)
                cycles += triggerInterrupt(0x48)
            } else if ( i&(1<<2) ) {
                IF &=~(1<<2)
                cycles += triggerInterrupt(0x50)
            } else if ( i&(1<<3) ) {
                IF &=~(1<<3)
                cycles += triggerInterrupt(0x58)
            } else if ( i&(1<<4) ) {
                IF &=~(1<<4)
                cycles += triggerInterrupt(0x60)
            }

        }
    }
    return cycles;
}