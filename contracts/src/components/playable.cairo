#[starknet::component]
pub mod PlayableComponent {
    // Imports

    use dojo::world::{IWorldDispatcherTrait, WorldStorage};
    use crate::models::game::{AssertTrait, GameAssert, GameTrait};
    use crate::models::player::{PlayerAssert, PlayerTrait};
    use crate::store::{StoreImpl, StoreTrait};

    // Storage

    #[storage]
    pub struct Storage {}

    // Events

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {}

    // Types

    #[derive(Drop, Copy, Clone, Serde, PartialEq)]
    pub struct LeafData {
        pub player_name: felt252,
        pub quantity: u32,
    }

    #[generate_trait]
    pub impl InternalImpl<
        TContractState, +HasComponent<TContractState>, +Drop<TContractState>,
    > of InternalTrait<TContractState> {
        fn initialize(ref self: ComponentState<TContractState>, world: WorldStorage) {}

        #[inline]
        fn spawn(
            ref self: ComponentState<TContractState>, world: WorldStorage, name: felt252,
        ) -> felt252 {
            // [Setup] Store
            let mut store = StoreImpl::new(world);

            // [Check] Player does not exist
            let caller: felt252 = starknet::get_caller_address().into();
            let player = store.player(caller);
            player.assert_not_exist();

            // [Effect] Spawn a player
            let player = PlayerTrait::new(caller, name);
            store.set_player(@player);

            // [Return] Player ID
            player.id
        }

        #[inline]
        fn rename(ref self: ComponentState<TContractState>, world: WorldStorage, name: felt252) {
            // [Setup] Store
            let mut store = StoreImpl::new(world);

            // [Check] Player exists
            let caller: felt252 = starknet::get_caller_address().into();
            let mut player = store.player(caller);
            player.assert_does_exist();

            // [Effect] Rename player
            player.rename(name);
            store.set_player(@player);
        }

        #[inline]
        fn create(
            ref self: ComponentState<TContractState>, world: WorldStorage, seed: felt252,
        ) -> u32 {
            // [Setup] Store
            let mut store = StoreImpl::new(world);

            // [Check] Player exists
            let caller: felt252 = starknet::get_caller_address().into();
            let player = store.player(caller);
            player.assert_does_exist();

            // [Effect] Create game
            let game_id = world.dispatcher.uuid();
            let seed = starknet::get_tx_info().unbox().transaction_hash;
            let mut game = GameTrait::new(player.id, game_id, seed);
            game.start();
            store.set_game(@game);

            // [Return] Game ID
            game.id
        }

        #[inline]
        fn place(
            ref self: ComponentState<TContractState>,
            world: WorldStorage,
            game_id: u32,
            piece_index: u8,
            grid_index: u8,
        ) {
            // [Setup] Store
            let mut store = StoreImpl::new(world);

            // [Check] Player exists
            let caller: felt252 = starknet::get_caller_address().into();
            let player = store.player(caller);
            player.assert_does_exist();

            // [Check] Game is valid
            let game = store.game(player.id, game_id);
            game.assert_has_started();
            game.assert_not_over();

            // [Effect] Place piece
            let mut game = store.game(player.id, game_id);
            game.place(piece_index, grid_index);

            // [Effect] Assess not over
            game.assess();

            // [Effect] Update entity
            store.set_game(@game);
        }
    }
}
