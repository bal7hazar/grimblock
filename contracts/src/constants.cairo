pub const DEFAULT_GRID_SIZE: u8 = 8;
pub const DEFAULT_MIN_BLOCK: u8 = 2;
pub const DEFAULT_MAX_BLOCK: u8 = 20;
pub const DEFAULT_DRAW_COUNT: u8 = 3;
pub const DEFAULT_LINE_SCORE: u16 = 10;

pub const PIECE_SIZE: u8 = 16; // 2 ** 4
pub const ORIENTATION_SIZE: u8 = 8; // 2 ** 3
pub const SUBPACK_SIZE: u32 = 256; // 2 ** 8

pub fn NAMESPACE() -> ByteArray {
    "GRIMBLOCK"
}
