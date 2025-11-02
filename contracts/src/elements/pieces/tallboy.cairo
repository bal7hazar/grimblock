use super::interface::{Orientation, PieceTrait};

pub impl TallBoy of PieceTrait {
    #[inline]
    fn get(orientation: Orientation) -> u64 {
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - 1 1
        // - - - - - - 1 1
        // - - - - - - 1 1
        match orientation {
            Orientation::Up | Orientation::Down => 0b00000011_00000011_00000011,
            Orientation::Left | Orientation::Right => 0b00000111_00000111,
            _ => 0,
        }
    }
}
