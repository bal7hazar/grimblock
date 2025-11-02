use super::interface::{Orientation, PieceTrait};

pub impl RhodeIsland of PieceTrait {
    #[inline]
    fn get(orientation: Orientation) -> u64 {
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - - -
        // - - - - - - 1 1
        // - - - - - 1 1 -
        match orientation {
            Orientation::Up | Orientation::Down => 0b00000011_00000110,
            Orientation::Left | Orientation::Right => 0b00000010_00000011_00000001,
            _ => 0,
        }
    }
}
