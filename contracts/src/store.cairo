use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use crate::models::index::{Game, Player};

#[derive(Drop)]
pub struct Store {
    pub world: WorldStorage,
}

#[generate_trait]
pub impl StoreImpl of StoreTrait {
    fn new(world: WorldStorage) -> Store {
        Store { world }
    }

    // Player

    fn player(ref self: Store, player_id: felt252) -> Player {
        self.world.read_model(player_id)
    }

    fn set_player(ref self: Store, player: @Player) {
        self.world.write_model(player)
    }

    // Game

    fn game(ref self: Store, player_id: felt252, game_id: u32) -> Game {
        self.world.read_model((player_id, game_id))
    }

    fn set_game(ref self: Store, game: @Game) {
        self.world.write_model(game)
    }
}
