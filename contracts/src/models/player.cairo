pub use crate::models::index::Player;

pub mod Errors {
    pub const PLAYER_INVALID_NAME: felt252 = 'Player: invalid name';
    pub const PLAYER_DOES_NOT_EXIST: felt252 = 'Player: does not exist';
    pub const PLAYER_ALREADY_EXISTS: felt252 = 'Player: already exists';
}

#[generate_trait]
pub impl PlayerImpl of PlayerTrait {
    #[inline]
    fn new(id: felt252, name: felt252) -> Player {
        // [Check] Inputs
        PlayerAssert::assert_valid_name(name);
        // [Return] Player
        Player { id: id, name: name }
    }

    #[inline]
    fn rename(ref self: Player, name: felt252) {
        // [Check] Inputs
        PlayerAssert::assert_valid_name(name);
        // [Effect] Rename player
        self.name = name;
    }
}

#[generate_trait]
pub impl PlayerAssert of AssertTrait {
    #[inline]
    fn assert_valid_name(name: felt252) {
        assert(name != 0, Errors::PLAYER_INVALID_NAME);
    }

    #[inline]
    fn assert_does_exist(self: @Player) {
        assert(*self.name != 0, Errors::PLAYER_DOES_NOT_EXIST);
    }

    #[inline]
    fn assert_not_exist(self: @Player) {
        assert(*self.name == 0, Errors::PLAYER_ALREADY_EXISTS);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const ID: felt252 = 'ID';
    const NAME: felt252 = 'NAME';

    #[test]
    fn test_player_new() {
        let mut player = PlayerTrait::new(ID, NAME);
        player.assert_does_exist();
    }
}
