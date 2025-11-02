//! Spread objects into a map.

// Internal imports

use crate::helpers::bitmap::Bitmap;
use crate::helpers::seeder::Seeder;

// Constants

const MULTIPLIER: u256 = 10000;

/// Errors module.
pub mod errors {
    pub const SPREADER_INVALID_DIMENSION: felt252 = 'Spreader: invalid dimension';
    pub const SPREADER_NOT_ENOUGH_PLACE: felt252 = 'Spreader: not enough place';
}

/// Implementation of the `SpreaderTrait` trait.
#[generate_trait]
pub impl Spreader<
    T, +Into<u8, T>, +Into<T, u256>, +TryInto<T, u8>, +TryInto<u256, T>, +Copy<T>, +Drop<T>,
> of SpreaderTrait<T> {
    /// Spread objects into a map.
    /// # Arguments
    /// * `grid` - The grid where to spread the objects
    /// * `width` - The width of the grid
    /// * `height` - The height of the grid
    /// * `count` - The number of objects to spread
    /// * `seed` - The seed to spread the objects
    /// # Returns
    /// * The grid with the objects spread
    #[inline]
    fn generate(grid: T, width: u8, height: u8, count: u8, mut seed: felt252) -> T {
        // [Check] Ensure there is enough space for the objects
        let total = Bitmap::popcount(grid);
        assert(count <= total, errors::SPREADER_NOT_ENOUGH_PLACE);
        // [Effect] Deposite objects uniformly
        let start = Bitmap::least_significant_bit(grid);
        let merge = Self::iter(grid, start, total, count, seed);
        let objects: u256 = grid.into() ^ merge.into();
        objects.try_into().unwrap()
    }

    /// Recursive function to spread objects into the grid.
    /// # Arguments
    /// * `grid` - The grid where to spread the objects
    /// * `index` - The current index
    /// * `total` - The total number of objects
    /// * `count` - The number of objects to spread
    /// * `seed` - The seed to spread the objects
    /// # Returns
    /// * The original grid with the objects spread set to 0
    #[inline]
    fn iter(mut grid: T, index: u8, total: u8, mut count: u8, seed: felt252) -> T {
        // [Check] Stop if all objects are placed
        if count == 0 {
            return grid;
        }
        // [Check] Skip if the position is already occupied
        let seed = Seeder::shuffle(seed, seed);
        if Bitmap::get(grid, index) == 0 {
            return Self::iter(grid, index + 1, total, count, seed);
        }
        // [Compute] Uniform random number between 0 and MULTIPLIER
        let random = seed.into() % MULTIPLIER;
        let probability: u256 = count.into() * MULTIPLIER / total.into();
        // [Check] Probability of being an object
        if random <= probability {
            // [Compute] Update grid
            count -= 1;
            // [Effect] Set bit to 0
            grid = Bitmap::unset(grid, index);
        }
        Self::iter(grid, index + 1, total - 1, count, seed)
    }
}

#[cfg(test)]
mod tests {
    // Local imports

    use super::Spreader;

    // Constants

    const SEED: felt252 = 'SEED';

    #[test]
    fn test_spreader_generate_small() {
        // 000000001110000000
        // 000000001110000000
        // 000000001110000000
        // Output:
        // 000000000010000000
        // 000000001000000000
        // 000000001100000000
        let width = 18;
        let height = 14;
        let grid: u64 = 0x38000E000380;
        let map = Spreader::generate(grid, width, height, 4, SEED);
        assert_eq!(map, 0x80008000300);
    }

    #[test]
    fn test_spreader_generate_smaller() {
        // 000000001110000000
        // 000000001110000000
        // 000000001110000000
        // Output:
        // 000000000010000000
        // 000000001000000000
        // 000000001100000000
        let width = 18;
        let height = 14;
        let grid: u16 = 0b1111;
        let map = Spreader::generate(grid, width, height, 4, SEED);
        assert_eq!(map, grid);
    }
}
