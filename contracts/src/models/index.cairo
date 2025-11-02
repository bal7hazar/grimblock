#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct Player {
    #[key]
    pub id: felt252,
    pub name: felt252,
}

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct Game {
    #[key]
    pub player_id: felt252,
    #[key]
    pub id: u32,
    pub streak: bool,
    pub over: bool,
    pub combo: u16,
    pub score: u32,
    pub pieces: u32,
    pub grid: u64,
    pub seed: felt252,
}
