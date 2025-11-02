pub use crate::types::orientation::Orientation;

pub trait PieceTrait {
    /// Return the piece for the given orientation
    /// # Arguments
    /// * `orientation` - The orientation of the piece
    /// # Returns
    /// * The piece for the given orientation
    fn get(orientation: Orientation) -> u64;
    /// Return the size of the piece (height, width)
    /// # Arguments
    /// * `orientation` - The orientation of the piece
    /// # Returns
    /// * The size of the piece (height, width)
    fn size(orientation: Orientation) -> (u8, u8);
    /// Return the score of the piece
    /// # Returns
    /// * The score of the piece
    fn score() -> u8;
}
