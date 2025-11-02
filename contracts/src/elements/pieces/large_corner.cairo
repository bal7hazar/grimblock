use super::interface::{Orientation, PieceTrait};

pub impl LargeCorner of PieceTrait {
    #[inline]
    fn get(orientation: Orientation) -> u64 {
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - 1
        // - - - - - - - 1
        // - - - - - 1 1 1
        match orientation {
            Orientation::Up => 0b00000001_00000001_00000111,
            Orientation::Down => 0b00000111_00000100_00000100,
            Orientation::Left => 0b00000111_00000001_00000001,
            Orientation::Right => 0b00000100_00000100_00000111,
            _ => 0,
        }
    }

    #[inline]
    fn size(orientation: Orientation) -> (u8, u8) {
        (3, 3)
    }

    #[inline]
    fn score() -> u8 {
        5
    }
}
