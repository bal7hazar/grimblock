pub use crate::types::orientation::Orientation;

pub trait PieceTrait {
    fn get(orientation: Orientation) -> u64;
}
