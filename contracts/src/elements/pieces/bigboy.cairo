use super::interface::{Orientation, PieceTrait};

pub impl BigBoy of PieceTrait {
    #[inline]
    fn get(orientation: Orientation) -> u64 {
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - 1 1 1
        // - - - - - 1 1 1
        // - - - - - 1 1 1
        return 0b00000111_00000111_00000111;
    }

    #[inline]
    fn size(orientation: Orientation) -> (u8, u8) {
        (3, 3)
    }

    #[inline]
    fn score() -> u8 {
        9
    }
}
