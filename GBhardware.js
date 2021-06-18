
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

const VBlank = 0x01;
const LCDC = 0x02;
const TimerOverflow = 0x04;
const SeriIOComplete = 0x08;
const TrPinJoyPad = 0x10;

// GameBoy Interrupt Adresses

const INT_VBlank = 0x0040;
const INT_LCDC = 0x0048;
const INT_TimerOverflow = 0x0050;
const INT_SeriIOComplete = 0x0058;
const INT_TrPinJoyPad = 0x0060;


// LCDC Operations

const LCDControlOperation = 0x80;
const WindowTileMapDisplaySelect = 0x40;
const WindowDisplay = 0x20;
const WindowTileDataSelect = 0x10;
const TileMapDisplaySelect = 0x08;
const SpriteSize = 0x04;
const SpriteDisplay = 0x02;
const WindowDisplay = 0x01;



