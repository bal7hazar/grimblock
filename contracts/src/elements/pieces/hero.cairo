use super::interface::{Orientation, PieceTrait};

pub impl Hero of PieceTrait {
    #[inline]
    fn get(orientation: Orientation) -> u64 {
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - 1
        // - - - - - - - 1
        // - - - - - - - 1
        // - - - - - - - 1
        match orientation {
            Orientation::Up | Orientation::Down => 0b00000001_00000001_00000001_00000001,
            Orientation::Left | Orientation::Right => 0b00001111,
            _ => 0,
        }
    }
}
