use super::interface::{Orientation, PieceTrait};

pub impl SuperHero of PieceTrait {
    #[inline]
    fn get(orientation: Orientation) -> u64 {
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - 1
        // - - - - - - - 1
        // - - - - - - - 1
        // - - - - - - - 1
        // - - - - - - - 1
        match orientation {
            Orientation::Up | Orientation::Down => 0b00000001_00000001_00000001_00000001_00000001,
            Orientation::Left | Orientation::Right => 0b00011111,
            _ => 0,
        }
    }

    #[inline]
    fn size(orientation: Orientation) -> (u8, u8) {
        match orientation {
            Orientation::Up | Orientation::Down => (5, 1),
            Orientation::Left | Orientation::Right => (1, 5),
            _ => (0, 0),
        }
    }

    #[inline]
    fn score() -> u8 {
        5
    }
}
