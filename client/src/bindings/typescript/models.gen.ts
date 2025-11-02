import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { BigNumberish } from 'starknet';

// Type definition for `grimblock::models::index::Game` struct
export interface Game {
	player_id: BigNumberish;
	id: BigNumberish;
	streak: boolean;
	over: boolean;
	combo: BigNumberish;
	score: BigNumberish;
	pieces: BigNumberish;
	grid: BigNumberish;
	seed: BigNumberish;
}

// Type definition for `grimblock::models::index::Player` struct
export interface Player {
	id: BigNumberish;
	name: BigNumberish;
}

export interface SchemaType extends ISchemaType {
	grimblock: {
		Game: Game,
		Player: Player,
	},
}
export const schema: SchemaType = {
	grimblock: {
		Game: {
			player_id: 0,
			id: 0,
			streak: false,
			over: false,
			combo: 0,
			score: 0,
			pieces: 0,
			grid: 0,
			seed: 0,
		},
		Player: {
			id: 0,
			name: 0,
		},
	},
};
export enum ModelsMapping {
	Game = 'grimblock-Game',
	Player = 'grimblock-Player',
}