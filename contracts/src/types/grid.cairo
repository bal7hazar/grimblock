use crate::helpers::bitmap::Bitmap;
use crate::helpers::power::TwoPower;
use crate::helpers::spreader::Spreader;

pub mod Errors {
    pub const GRID_INSERT_INVALID_POSITION: felt252 = 'Grid: insert invalid position';
}

#[generate_trait]
pub impl Grid of GridTrait {
    /// Create a grid with the specified size and count
    /// # Arguments
    /// * `size` - The size of the grid
    /// * `count` - The number of blocks to create
    /// * `seed` - The seed to use for the grid
    /// # Returns
    /// * The created grid
    #[inline]
    fn create(size: u8, count: u8, seed: felt252) -> u64 {
        let grid: u64 = core::num::traits::Bounded::MAX;
        ~Spreader::iter(grid, 0, size * size, count, seed)
    }

    /// Cheaper, but maybe unecessary.
    /// # Arguments
    /// * `size` - The size of the grid
    /// * `count` - The number of blocks to create
    /// * `seed` - The seed to use for the grid
    /// # Returns
    /// * The created grid
    #[inline]
    fn create2(size: u8, count: u8, seed: felt252) -> u64 {
        let grid: u16 = core::num::traits::Bounded::MAX;
        // Spreader::generate(grid, size, size, block_count, seed)
        let p16: u64 = TwoPower::pow(16).low.try_into().unwrap();
        let pattern_size = size * size / 4;
        let pattern: u16 = ~Spreader::iter(grid, 0, pattern_size, count / 4, seed);
        let mirror_x = _mirror_horizontal(pattern);
        let mirror_y = _mirror_vertical(pattern);
        let mirror_xy = _mirror_horizontal(mirror_y);
        ((pattern.into() * p16 + mirror_x.into()) * p16 + mirror_xy.into()) * p16 + mirror_y.into()
    }

    /// Insert a piece at the specified index
    /// # Arguments
    /// * `grid` - The grid to insert the piece into
    /// * `piece` - The piece to insert
    /// * `index` - The index of the position to insert the piece at
    /// # Returns
    /// * The updated grid
    #[inline]
    fn insert(grid: u64, piece: u64, index: u8) -> u64 {
        // [Check] Position is empty
        let offset: u64 = TwoPower::pow(index).low.try_into().unwrap();
        let piece_offset: u64 = piece * offset;
        assert(grid & piece_offset == 0, Errors::GRID_INSERT_INVALID_POSITION);
        // [Return] Insert piece at position
        grid + piece_offset
    }

    /// Return the height and width of a piece
    /// # Arguments
    /// * `piece` - The piece to assess
    /// * `grid_size` - The size of the grid
    /// # Returns
    /// * The height and width of the piece
    #[inline]
    fn size(piece: u64, grid_size: u8) -> (u8, u8) {
        let original = Bitmap::most_significant_bit(piece);
        let transpose = Bitmap::most_significant_bit(_transpose(piece));
        let height = core::cmp::max(original / grid_size + 1, transpose % grid_size + 1);
        let width = core::cmp::max(original % grid_size + 1, transpose / grid_size + 1);
        (height, width)
    }

    /// Assess if a piece can be inserted
    /// # Arguments
    /// * `grid` - The grid to assess
    /// * `size` - The size of the grid
    /// * `piece` - The piece to assess
    /// # Returns
    /// * The result of the assessment
    #[inline]
    fn is_over(grid: u64, size: u8, mut piece: u64) -> bool {
        let (height, width) = Self::size(piece, size);
        let mut index = 0;
        let max_index = size * (size + 1 - height) - width;
        let max_row_index = size - width;
        let width_index_shift: u64 = TwoPower::pow(width).low.try_into().unwrap();
        loop {
            if grid & piece == 0 {
                return false;
            }
            let condition = index % size == max_row_index;
            index += if condition {
                width
            } else {
                1
            };
            if index > max_index {
                break;
            }
            piece *= if condition {
                width_index_shift
            } else {
                2
            };
        }
        true
    }

    /// Return the number of lines completed and the updated grid
    /// # Arguments
    /// * `grid` - The grid to assess and update
    /// * `size` - The size of the grid
    /// # Returns
    /// * The number of lines completed
    #[inline]
    fn update(grid: u64, size: u8) -> (u64, u8) {
        // [Compute] Number of rows completed
        let offset: u64 = TwoPower::pow(size).low.try_into().unwrap();
        let mut mask: u64 = offset - 1;
        let mut horizontal = grid;
        let mut rows: u8 = 0;
        let mut index = size;
        loop {
            if horizontal & mask == mask {
                horizontal = horizontal ^ mask;
                rows += 1;
            }
            index -= 1;
            if index == 0 {
                break;
            }
            mask *= offset;
        }
        // [Compute] Number of columns completed
        let mut mask: u64 = offset - 1;
        let mut vertical = _transpose(grid);
        let mut columns: u8 = 0;
        let mut index = size;
        loop {
            if vertical & mask == mask {
                vertical = vertical ^ mask;
                columns += 1;
            }
            index -= 1;
            if index == 0 {
                break;
            }
            mask *= offset;
        }
        // [Return] Updated grid and number of lines completed
        (horizontal & _transpose(vertical), rows + columns)
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

#[inline]
fn _mirror_horizontal(mut x: u16) -> u16 {
    let p1: u16 = TwoPower::pow(1).low.try_into().unwrap();
    let p2: u16 = TwoPower::pow(2).low.try_into().unwrap();
    x = ((x / p1) & 0x5555) | ((x & 0x5555) * p1);
    ((x / p2) & 0x3333) | ((x & 0x3333) * p2)
}

#[inline]
fn _mirror_vertical(x: u16) -> u16 {
    let p4: u16 = TwoPower::pow(4).low.try_into().unwrap();
    let p8: u16 = TwoPower::pow(8).low.try_into().unwrap();
    let t = (x ^ (x / p4)) & 0x0F0F;
    let x = x ^ t ^ (t * p4);
    let t = (x ^ (x / p8)) & 0x00FF;
    x ^ t ^ (t * p8)
}

#[cfg(test)]
mod tests {
    use crate::helpers::power::TwoPower;
    use crate::types::orientation::Orientation;
    use crate::types::piece::{Piece, PieceTrait};
    use super::*;

    const GRID_SIZE: u8 = 8;
    const SEED: felt252 = 'SEED';

    #[test]
    fn test_grid_create() {
        let grid = GridTrait::create(GRID_SIZE, 8, SEED);
        assert_eq!(grid, 146661665595752480);
    }

    #[test]
    fn test_grid_create2() {
        let grid = GridTrait::create2(GRID_SIZE, 8, SEED);
        assert_eq!(grid, 2314920852157891074);
    }

    #[test]
    fn test_grid_insert() {
        let grid = 0;
        let piece: u64 = PieceTrait::get(Piece::BigBoy, Orientation::Up);
        assert_eq!(GridTrait::insert(grid, piece, 0), piece);
    }

    #[test]
    fn test_grid_update() {
        let mut grid = 0b11111111_10000001_10000001_10000001_10000001_10000001_10000001_10010001;
        let (grid, lines) = GridTrait::update(grid, GRID_SIZE);
        assert_eq!(lines, 3);
        assert_eq!(grid, 0b00010000);
    }

    #[test]
    fn test_grid_is_over_hero_false() {
        let grid = 0b01111111_01111111_01111111_01111111_11111111_11111111_11111111_11111111;
        let piece = Piece::Hero.get(Orientation::Up);
        assert_eq!(GridTrait::is_over(grid, GRID_SIZE, piece), false);
    }

    #[test]
    fn test_grid_is_over_hero_true() {
        let grid = 0b11111111_11111111_11111111_11111111_11111111_11111111_11111111_11111111;
        let piece = Piece::Hero.get(Orientation::Up);
        assert_eq!(GridTrait::is_over(grid, GRID_SIZE, piece), true);
    }

    #[test]
    fn test_grid_is_over_cleveland_z_false() {
        let grid = 0b00111111_10011111_11111111_11111111_11111111_11111111_11111111_11111111;
        let piece = Piece::ClevelandZ.get(Orientation::Up);
        assert_eq!(GridTrait::is_over(grid, GRID_SIZE, piece), false);
    }

    #[test]
    fn test_grid_is_over_cleveland_z_true() {
        let grid = 0b11111111_11111111_11111111_11111111_11111111_11111111_11111111_11111111;
        let piece = Piece::ClevelandZ.get(Orientation::Up);
        assert_eq!(GridTrait::is_over(grid, GRID_SIZE, piece), true);
    }

    #[test]
    fn test_grid_is_over_teewee_false() {
        let grid = 0b00011111_10111111_11111111_11111111_11111111_11111111_11111111_11111111;
        let piece = Piece::Teewee.get(Orientation::Down);
        assert_eq!(GridTrait::is_over(grid, GRID_SIZE, piece), false);
    }

    #[test]
    fn test_grid_is_over_teewee_true() {
        let grid = 0b00011111_10111111_11111111_11111111_11111111_11111111_11111111_11111111;
        let piece = Piece::Teewee.get(Orientation::Up);
        assert_eq!(GridTrait::is_over(grid, GRID_SIZE, piece), true);
    }

    #[test]
    fn test_grid_size_blue_ricky() {
        let orientation = Orientation::Up;
        let piece = Piece::BlueRicky;
        let (height, width) = GridTrait::size(piece.get(orientation), GRID_SIZE);
        let (ref_height, ref_width) = piece.size(orientation);
        assert_eq!(height, ref_height);
        assert_eq!(width, ref_width);
        let orientation = Orientation::Down;
        let (height, width) = GridTrait::size(piece.get(orientation), GRID_SIZE);
        let (ref_height, ref_width) = piece.size(orientation);
        assert_eq!(height, ref_height);
        assert_eq!(width, ref_width);
        let orientation = Orientation::Left;
        let (height, width) = GridTrait::size(piece.get(orientation), GRID_SIZE);
        let (ref_height, ref_width) = piece.size(orientation);
        assert_eq!(height, ref_height);
        assert_eq!(width, ref_width);
        let orientation = Orientation::Right;
        let (height, width) = GridTrait::size(piece.get(orientation), GRID_SIZE);
        let (ref_height, ref_width) = piece.size(orientation);
        assert_eq!(height, ref_height);
        assert_eq!(width, ref_width);
    }

    #[test]
    fn test_grid_size_rhode_island() {
        let orientation = Orientation::Up;
        let piece = Piece::RhodeIsland;
        let (height, width) = GridTrait::size(piece.get(orientation), GRID_SIZE);
        let (ref_height, ref_width) = piece.size(orientation);
        assert_eq!(height, ref_height);
        assert_eq!(width, ref_width);
        let orientation = Orientation::Down;
        let (height, width) = GridTrait::size(piece.get(orientation), GRID_SIZE);
        let (ref_height, ref_width) = piece.size(orientation);
        assert_eq!(height, ref_height);
        assert_eq!(width, ref_width);
        let orientation = Orientation::Left;
        let (height, width) = GridTrait::size(piece.get(orientation), GRID_SIZE);
        let (ref_height, ref_width) = piece.size(orientation);
        assert_eq!(height, ref_height);
        assert_eq!(width, ref_width);
        let orientation = Orientation::Right;
        let (height, width) = GridTrait::size(piece.get(orientation), GRID_SIZE);
        let (ref_height, ref_width) = piece.size(orientation);
        assert_eq!(height, ref_height);
        assert_eq!(width, ref_width);
    }

    #[test]
    fn test_grid_size_cleveland_z() {
        let orientation = Orientation::Up;
        let piece = Piece::ClevelandZ;
        let (height, width) = GridTrait::size(piece.get(orientation), GRID_SIZE);
        let (ref_height, ref_width) = piece.size(orientation);
        assert_eq!(height, ref_height);
        assert_eq!(width, ref_width);
        let orientation = Orientation::Down;
        let (height, width) = GridTrait::size(piece.get(orientation), GRID_SIZE);
        let (ref_height, ref_width) = piece.size(orientation);
        assert_eq!(height, ref_height);
        assert_eq!(width, ref_width);
        let orientation = Orientation::Left;
        let (height, width) = GridTrait::size(piece.get(orientation), GRID_SIZE);
        let (ref_height, ref_width) = piece.size(orientation);
        assert_eq!(height, ref_height);
        assert_eq!(width, ref_width);
        let orientation = Orientation::Right;
        let (height, width) = GridTrait::size(piece.get(orientation), GRID_SIZE);
        let (ref_height, ref_width) = piece.size(orientation);
        assert_eq!(height, ref_height);
        assert_eq!(width, ref_width);
    }

    #[test]
    fn test_grid_mirror_horizontal() {
        let x = 0b1100_1100_1100_1100;
        let y = _mirror_horizontal(x);
        assert_eq!(y, 0b0011_0011_0011_0011);
    }

    #[test]
    fn test_grid_mirror_vertical() {
        let x = 0b1010_1010_0000_0000;
        let y = _mirror_vertical(x);
        assert_eq!(y, 0b0000_0000_1010_1010);
    }

    #[test]
    fn test_grid_mirror_horizontal_and_vertical() {
        let x = 0b1100_1000_0000_0000;
        let y = _mirror_horizontal(x);
        let z = _mirror_vertical(y);
        assert_eq!(z, 0b0000_0000_0001_0011);
    }
}
