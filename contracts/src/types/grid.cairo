use crate::helpers::power::TwoPower;

pub mod Errors {
    pub const GRID_INSERT_INVALID_POSITION: felt252 = 'Grid: insert invalid position';
}

#[generate_trait]
pub impl GridImpl of GridTrait {
    #[inline]
    fn insert(grid: u64, piece: u64, index: u8) -> u64 {
        // [Check] Position is empty
        let offset: u64 = TwoPower::pow(index).low.try_into().unwrap();
        let piece_offset: u64 = piece * offset;
        assert(grid & piece_offset == 0, Errors::GRID_INSERT_INVALID_POSITION);
        // [Return] Insert piece at position
        grid + piece_offset
    }

    #[inline]
    /// Assess the number of lines completed
    /// # Arguments
    /// * `grid` - The grid to assess
    /// # Returns
    /// * The number of lines completed
    fn assess(grid: u64, size: u8) -> u8 {
        // [Compute] Number of lines completed
        let offset: u64 = TwoPower::pow(size).low.try_into().unwrap();
        let mask: u64 = offset - 1;
        let mut bitmap = grid;
        let mut lines: u8 = 0;
        while bitmap > 0 {
            if bitmap & mask == mask {
                lines += 1;
            }
            bitmap /= offset;
        }
        // [Compute] Number of columns completed
        let mut bitmap = _transpose(grid);
        let mut columns: u8 = 0;
        while bitmap > 0 {
            if bitmap & mask == mask {
                columns += 1;
            }
            bitmap /= offset;
        }
        lines + columns
    }

    #[inline]
    fn progress(grid: u64) -> u64 {
        0
    }
}

#[inline]
pub fn _transpose(x: u64) -> u64 {
    let power_7: u64 = TwoPower::pow(7).low.try_into().unwrap();
    let power_14: u64 = TwoPower::pow(14).low.try_into().unwrap();
    let power_28: u64 = TwoPower::pow(28).low.try_into().unwrap();
    let t = (x ^ (x / power_7)) & 0x00AA00AA00AA00AA;
    let x = x ^ t ^ (t * power_7);
    let t = (x ^ (x / power_14)) & 0x0000CCCC0000CCCC;
    let x = x ^ t ^ (t * power_14);
    let t = (x ^ (x / power_28)) & 0x00000000F0F0F0F0;
    let x = x ^ t ^ (t * power_28);
    x
}

#[cfg(test)]
mod tests {
    use crate::helpers::power::TwoPower;
    use crate::types::orientation::Orientation;
    use crate::types::piece::{Piece, PieceTrait};
    use super::*;

    #[test]
    fn test_grid_insert() {
        let grid = 0;
        let piece: u64 = PieceTrait::get(Piece::BigBoy, Orientation::Up);
        assert_eq!(GridImpl::insert(grid, piece, 0), piece);
    }

    #[test]
    fn test_grid_assess() {
        let grid = 0b11111111_00000001_00000001_00000001_00000001_00000001_00000001_00000001;
        let size = 8;
        assert_eq!(GridImpl::assess(grid, size), 2);
    }
}
