use super::interface::{Orientation, PieceTrait};

pub impl OrangeRicky of PieceTrait {
    #[inline]
    fn get(orientation: Orientation) -> u64 {
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - 1
        // - - - - - 1 1 1
        match orientation {
            Orientation::Up => 0b00000001_00000111,
            Orientation::Down => 0b00000111_00000100,
            Orientation::Left => 0b00000011_00000001_00000001,
            Orientation::Right => 0b00000010_00000010_00000011,
            _ => 0,
        }
    }
}
