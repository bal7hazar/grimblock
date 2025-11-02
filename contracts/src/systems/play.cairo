#[inline]
pub fn NAME() -> ByteArray {
    "Play"
}

#[starknet::interface]
pub trait IPlay<T> {
    fn spawn(ref self: T, player_name: felt252) -> felt252;
    fn rename(ref self: T, player_name: felt252);
    fn create(ref self: T) -> u32;
    fn place(ref self: T, game_id: u32, piece_index: u8, grid_index: u8);
}

#[dojo::contract]
pub mod Play {
    use crate::components::playable::PlayableComponent;
    use crate::constants::NAMESPACE;
    use super::IPlay;

    // Components

    component!(path: PlayableComponent, storage: playable, event: PlayableEvent);
    impl PlayableInternalImpl = PlayableComponent::InternalImpl<ContractState>;

    // Storage

    #[storage]
    struct Storage {
        #[substorage(v0)]
        playable: PlayableComponent::Storage,
    }

    // Events

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        PlayableEvent: PlayableComponent::Event,
    }

    #[abi(embed_v0)]
    impl PlayImpl of IPlay<ContractState> {
        fn spawn(ref self: ContractState, player_name: felt252) -> felt252 {
            // [Setup] World
            let world = self.world(@NAMESPACE());
            // [Effect] Spawn player
            self.playable.spawn(world, player_name)
        }

        fn rename(ref self: ContractState, player_name: felt252) {
            // [Setup] World
            let world = self.world(@NAMESPACE());
            // [Effect] Rename player
            self.playable.rename(world, player_name)
        }

        fn create(ref self: ContractState) -> u32 {
            // [Setup] World
            let world = self.world(@NAMESPACE());
            // [Effect] Create game
            self.playable.create(world)
        }

        fn place(ref self: ContractState, game_id: u32, piece_index: u8, grid_index: u8) {
            // [Setup] World
            let world = self.world(@NAMESPACE());
            // [Effect] Place piece
            self.playable.place(world, game_id, piece_index, grid_index)
        }
    }
}

