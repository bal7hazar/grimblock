use crate::constants::{
    DEFAULT_DRAW_COUNT, DEFAULT_GRID_SIZE, DEFAULT_LINE_SCORE, PIECE_SIZE, SUBPACK_SIZE,
};
use crate::helpers::packer::Packer;
use crate::helpers::seeder::Seeder;
pub use crate::models::index::Game;
use crate::types::grid::Grid;
use crate::types::orientation::{Orientation, OrientationTrait};
use crate::types::piece::{Piece, PieceTrait};

pub mod Errors {
    pub const GAME_IS_OVER: felt252 = 'Game: is over';
    pub const GAME_NOT_STARTED: felt252 = 'Game: not started';
    pub const GAME_ALREADY_STARTED: felt252 = 'Game: already started';
    pub const GAME_INVALID_PLAYER: felt252 = 'Game: invalid player';
    pub const GAME_INVALID_PIECE: felt252 = 'Game: invalid piece';
}

#[generate_trait]
pub impl GameImpl of GameTrait {
    #[inline]
    fn new(player_id: felt252, game_id: u32, seed: felt252) -> Game {
        Game {
            player_id: player_id,
            id: game_id,
            streak: false,
            over: false,
            combo: 0,
            score: 0,
            pieces: 0,
            grid: 0,
            seed: seed,
        }
    }

    #[inline]
    fn start(ref self: Game) {
        self.pieces = _draw(self.seed.into());
    }

    #[inline]
    fn place(ref self: Game, piece_index: u8, grid_index: u8) {
        // [Check] Piece is valid
        let mut pieces: Array<u8> = Packer::unpack(self.pieces, SUBPACK_SIZE);
        let packed = *pieces.at(piece_index.into());
        assert(packed != 0, Errors::GAME_INVALID_PIECE);
        // [Effect] Update the grid
        let piece: Piece = (packed % PIECE_SIZE).into();
        let orientation: Orientation = (packed / PIECE_SIZE).into();
        // FIXMEL: u128 temporary
        let mut grid: u64 = self.grid.try_into().unwrap();
        grid = Grid::insert(grid, PieceTrait::get(piece, orientation), grid_index);
        let (grid, line_count) = Grid::update(grid, DEFAULT_GRID_SIZE);
        self.grid = grid.into();
        let score = PieceTrait::score(piece).into()
            + self.combo * line_count.into() * DEFAULT_LINE_SCORE;
        self.score += score.into();
        if line_count > 0 {
            self.combo += 1;
            self.streak = true;
        }
        // [Effect] Remove the piece from the pieces
        let mut new_pieces = array![];
        let mut index = 0;
        let mut missing: u32 = DEFAULT_DRAW_COUNT.into() - pieces.len();
        while let Option::Some(packed) = pieces.pop_front() {
            if index != piece_index && packed != 0 {
                new_pieces.append(packed);
            } else {
                new_pieces.append(0);
                missing += 1;
            }
            index += 1;
        }
        // [Effect] Pack the remaining pieces or draw new ones
        self
            .pieces =
                if missing == DEFAULT_DRAW_COUNT.into() {
                    // [Effect] Reset combo counter if the streak is broken
                    if !self.streak {
                        self.combo = 0;
                    }
                    // [Effect] Reset the streak
                    self.streak = false;
                    // [Return] The new pieces
                    self.seed = Seeder::shuffle(self.seed, self.seed);
                    _draw(self.seed.into())
                } else {
                    // [Return] Pack the remaining pieces
                    Packer::pack(new_pieces, SUBPACK_SIZE)
                };
    }

    #[inline]
    fn assess(ref self: Game) {
        let mut pieces: Array<u8> = Packer::unpack(self.pieces, SUBPACK_SIZE);
        let mut over = true;
        while let Option::Some(packed) = pieces.pop_front() {
            let piece: Piece = (packed % PIECE_SIZE).into();
            let orientation: Orientation = (packed / PIECE_SIZE).into();
            // FIXMEL: u128 temporary
            let grid: u64 = self.grid.try_into().unwrap();
            over = over & Grid::is_over(grid, DEFAULT_GRID_SIZE, piece.get(orientation));
        }
        self.over = over;
    }
}

#[generate_trait]
pub impl GameAssert of AssertTrait {
    #[inline]
    fn assert_not_over(self: @Game) {
        assert(!*self.over, Errors::GAME_IS_OVER);
    }

    #[inline]
    fn assert_has_started(self: @Game) {
        assert(*self.pieces != 0, Errors::GAME_NOT_STARTED);
    }

    #[inline]
    fn assert_not_started(self: @Game) {
        assert(*self.pieces == 0, Errors::GAME_ALREADY_STARTED);
    }

    #[inline]
    fn assert_valid_player(self: @Game, player_id: felt252) {
        assert(*self.player_id == player_id, Errors::GAME_INVALID_PLAYER);
    }
}

#[inline]
fn _draw(mut seed: u256) -> u32 {
    let mut index = DEFAULT_DRAW_COUNT;
    let mut subpacks: Array<u8> = array![];
    while index > 0 {
        let piece: u8 = PieceTrait::draw(seed.low).into();
        let orientation: u8 = OrientationTrait::draw(seed.high).into();
        seed = Seeder::shuffle(seed.low.into(), seed.high.into()).into();
        index -= 1;
        let subpack: u8 = orientation * PIECE_SIZE + piece;
        subpacks.append(subpack);
    }
    Packer::pack(subpacks, SUBPACK_SIZE)
}

#[cfg(test)]
mod tests {
    use super::*;

    const PLAYER_ID: felt252 = 'PLAYER';
    const GAME_ID: u32 = 0;
    const SEED: felt252 = 'SEED';

    #[test]
    fn test_game_new() {
        let mut game = GameTrait::new(PLAYER_ID, GAME_ID, SEED);
        assert_eq!(game.pieces, 0);
        game.start();
        assert_eq!(game.pieces != 0, true);
    }

    #[test]
    fn test_game_place_first() {
        let mut game = GameTrait::new(PLAYER_ID, GAME_ID, SEED);
        game.start();
        game.pieces = 0x134632;
        game.place(0, 0);
        assert_eq!(game.pieces, 0x134600);
    }

    #[test]
    fn test_game_place_last() {
        let mut game = GameTrait::new(PLAYER_ID, GAME_ID, SEED);
        game.start();
        game.pieces = 0x134632;
        game.place(2, 0);
        assert_eq!(game.pieces, 0x4632);
    }

    #[test]
    fn test_game_place_all() {
        let mut game = GameTrait::new(PLAYER_ID, GAME_ID, SEED);
        game.start();
        game.pieces = 4063294;
        game.place(0, 40);
        game.place(1, 32);
        game.seed = 0x05cfe5c5398881dba68c7644468cf2c208bf12b98486ed66a8613f95c8dcced9;
        game.place(2, 16);
        game.assess();
        assert_eq!(game.over, false);
        // game.pieces = 4063294;
    // game.place(2, 32);
    // game.place(1, 35);
    // game.place(0, 39);
    // game.assess();
    // assert_eq!(game.over, false);
    }

    #[test]
    fn test_game_place_case_002() {
        let mut game = GameTrait::new(PLAYER_ID, GAME_ID, SEED);
        game.start();
        game.grid = 0b11110000_00000000_00000000_00000000_00000000_01010001_01010000_00000000;
        game.pieces = 0x13;
        game.place(0, 8);
    }

    #[test]
    fn test_game_place_case_003() {
        let mut game = GameTrait::new(PLAYER_ID, GAME_ID, SEED);
        game.start();
        game.grid = 0b00111111_00111111_10101111_10101111_10100111_10110111_10100110_10010000;
        game.pieces = 0b0010_0001;
        game.assess();
        assert_eq!(game.over, true);
    }

    #[test]
    fn test_game_place_case_004() {
        let mut game = GameTrait::new(PLAYER_ID, GAME_ID, SEED);
        game.start();
        game.grid = 0b11101000_00111111_11110111_01100111_01100011_01111011_00001001_00001001;
        game.pieces = 0b0001_0100_0100_1011; // Up Corner + Right SuperHero
        game.assess();
        assert_eq!(game.over, false);
    }
}
