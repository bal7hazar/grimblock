use super::interface::{Orientation, PieceTrait};

pub impl Teewee of PieceTrait {
    #[inline]
    fn get(orientation: Orientation) -> u64 {
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - 1 -
        // - - - - - 1 1 1
        match orientation {
            Orientation::Up => 0b00000010_00000111,
            Orientation::Down => 0b00000111_00000010,
            Orientation::Left => 0b00000001_00000011_00000001,
            Orientation::Right => 0b00000010_00000011_00000010,
            _ => 0,
        }
    }

    #[inline]
    fn size(orientation: Orientation) -> (u8, u8) {
        match orientation {
            Orientation::Up | Orientation::Down => (2, 3),
            Orientation::Left | Orientation::Right => (3, 2),
            _ => (0, 0),
        }
    }

    #[inline]
    fn score() -> u8 {
        4
    }
}
