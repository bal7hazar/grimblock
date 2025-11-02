use crate::elements::pieces;
use crate::types::orientation::Orientation;

pub const PIECE_COUNT: u8 = 14;

#[derive(PartialEq, Copy, Drop, Debug)]
pub enum Piece {
    None,
    BigBoy,
    BlueRicky,
    ClevelandZ,
    Corner,
    Domino,
    Hero,
    LargeCorner,
    OrangeRicky,
    RhodeIsland,
    Smashboy,
    SuperHero,
    Tallboy,
    Teewee,
    Triomino,
}

#[generate_trait]
pub impl PieceImpl of PieceTrait {
    #[inline]
    fn draw(seed: u128) -> Piece {
        (1_u8 + (seed % PIECE_COUNT.into()).try_into().unwrap()).into()
    }

    #[inline]
    fn get(self: Piece, orientation: Orientation) -> u64 {
        match self {
            Piece::None => 0,
            Piece::BigBoy => pieces::bigboy::BigBoy::get(orientation),
            Piece::BlueRicky => pieces::blue_ricky::BlueRicky::get(orientation),
            Piece::ClevelandZ => pieces::cleveland_z::ClevelandZ::get(orientation),
            Piece::Corner => pieces::corner::Corner::get(orientation),
            Piece::Domino => pieces::domino::Domino::get(orientation),
            Piece::Hero => pieces::hero::Hero::get(orientation),
            Piece::LargeCorner => pieces::large_corner::LargeCorner::get(orientation),
            Piece::OrangeRicky => pieces::orange_ricky::OrangeRicky::get(orientation),
            Piece::RhodeIsland => pieces::rhode_island::RhodeIsland::get(orientation),
            Piece::Smashboy => pieces::smashboy::SmashBoy::get(orientation),
            Piece::SuperHero => pieces::super_hero::SuperHero::get(orientation),
            Piece::Tallboy => pieces::tallboy::TallBoy::get(orientation),
            Piece::Teewee => pieces::teewee::Teewee::get(orientation),
            Piece::Triomino => pieces::triomino::Triomino::get(orientation),
        }
    }

    #[inline]
    fn size(self: Piece, orientation: Orientation) -> (u8, u8) {
        match self {
            Piece::None => (0, 0),
            Piece::BigBoy => pieces::bigboy::BigBoy::size(orientation),
            Piece::BlueRicky => pieces::blue_ricky::BlueRicky::size(orientation),
            Piece::ClevelandZ => pieces::cleveland_z::ClevelandZ::size(orientation),
            Piece::Corner => pieces::corner::Corner::size(orientation),
            Piece::Domino => pieces::domino::Domino::size(orientation),
            Piece::Hero => pieces::hero::Hero::size(orientation),
            Piece::LargeCorner => pieces::large_corner::LargeCorner::size(orientation),
            Piece::OrangeRicky => pieces::orange_ricky::OrangeRicky::size(orientation),
            Piece::RhodeIsland => pieces::rhode_island::RhodeIsland::size(orientation),
            Piece::Smashboy => pieces::smashboy::SmashBoy::size(orientation),
            Piece::SuperHero => pieces::super_hero::SuperHero::size(orientation),
            Piece::Tallboy => pieces::tallboy::TallBoy::size(orientation),
            Piece::Teewee => pieces::teewee::Teewee::size(orientation),
            Piece::Triomino => pieces::triomino::Triomino::size(orientation),
        }
    }

    #[inline]
    fn score(self: Piece) -> u8 {
        match self {
            Piece::None => 0,
            Piece::BigBoy => pieces::bigboy::BigBoy::score(),
            Piece::BlueRicky => pieces::blue_ricky::BlueRicky::score(),
            Piece::ClevelandZ => pieces::cleveland_z::ClevelandZ::score(),
            Piece::Corner => pieces::corner::Corner::score(),
            Piece::Domino => pieces::domino::Domino::score(),
            Piece::Hero => pieces::hero::Hero::score(),
            Piece::LargeCorner => pieces::large_corner::LargeCorner::score(),
            Piece::OrangeRicky => pieces::orange_ricky::OrangeRicky::score(),
            Piece::RhodeIsland => pieces::rhode_island::RhodeIsland::score(),
            Piece::Smashboy => pieces::smashboy::SmashBoy::score(),
            Piece::SuperHero => pieces::super_hero::SuperHero::score(),
            Piece::Tallboy => pieces::tallboy::TallBoy::score(),
            Piece::Teewee => pieces::teewee::Teewee::score(),
            Piece::Triomino => pieces::triomino::Triomino::score(),
        }
    }
}

pub impl PieceIntoU64 of Into<Piece, u8> {
    #[inline]
    fn into(self: Piece) -> u8 {
        match self {
            Piece::None => 0,
            Piece::BigBoy => 1,
            Piece::BlueRicky => 2,
            Piece::ClevelandZ => 3,
            Piece::Corner => 4,
            Piece::Domino => 5,
            Piece::Hero => 6,
            Piece::LargeCorner => 7,
            Piece::OrangeRicky => 8,
            Piece::RhodeIsland => 9,
            Piece::Smashboy => 10,
            Piece::SuperHero => 11,
            Piece::Tallboy => 12,
            Piece::Teewee => 13,
            Piece::Triomino => 14,
        }
    }
}

pub impl PieceFromU64 of Into<u8, Piece> {
    #[inline]
    fn into(self: u8) -> Piece {
        match self {
            0 => Piece::None,
            1 => Piece::BigBoy,
            2 => Piece::BlueRicky,
            3 => Piece::ClevelandZ,
            4 => Piece::Corner,
            5 => Piece::Domino,
            6 => Piece::Hero,
            7 => Piece::LargeCorner,
            8 => Piece::OrangeRicky,
            9 => Piece::RhodeIsland,
            10 => Piece::Smashboy,
            11 => Piece::SuperHero,
            12 => Piece::Tallboy,
            13 => Piece::Teewee,
            14 => Piece::Triomino,
            _ => Piece::None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_piece_draw() {
        assert_eq!(PieceImpl::draw(0), PieceImpl::draw(PIECE_COUNT.into()));
    }
}
