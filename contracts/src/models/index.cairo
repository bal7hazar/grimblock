#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct Game {
    #[key]
    pub id: u64,
    pub stages: felt252,
    pub map: felt252,
}

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct Stage {
    #[key]
    pub id: u64,
    pub over: bool,
    pub pieces: u32,
    pub grid: u64,
}
