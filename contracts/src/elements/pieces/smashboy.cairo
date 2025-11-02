use super::interface::{Orientation, PieceTrait};

pub impl SmashBoy of PieceTrait {
    #[inline]
    fn get(orientation: Orientation) -> u64 {
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - 1 1
        // - - - - - - 1 1
        return 0b00000011_00000011;
    }

    #[inline]
    fn size(orientation: Orientation) -> (u8, u8) {
        (2, 2)
    }

    #[inline]
    fn score() -> u8 {
        4
    }
}
