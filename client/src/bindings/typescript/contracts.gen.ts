import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish } from "starknet";

export function setupWorld(provider: DojoProvider) {

	const build_Play_create_calldata = (): DojoCall => {
		return {
			contractName: "Play",
			entrypoint: "create",
			calldata: [],
		};
	};

	const Play_create = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_Play_create_calldata(),
				"GRIMBLOCK",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Play_place_calldata = (gameId: BigNumberish, pieceIndex: BigNumberish, gridIndex: BigNumberish): DojoCall => {
		return {
			contractName: "Play",
			entrypoint: "place",
			calldata: [gameId, pieceIndex, gridIndex],
		};
	};

	const Play_place = async (snAccount: Account | AccountInterface, gameId: BigNumberish, pieceIndex: BigNumberish, gridIndex: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Play_place_calldata(gameId, pieceIndex, gridIndex),
				"GRIMBLOCK",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Play_rename_calldata = (playerName: BigNumberish): DojoCall => {
		return {
			contractName: "Play",
			entrypoint: "rename",
			calldata: [playerName],
		};
	};

	const Play_rename = async (snAccount: Account | AccountInterface, playerName: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Play_rename_calldata(playerName),
				"GRIMBLOCK",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_Play_spawn_calldata = (playerName: BigNumberish): DojoCall => {
		return {
			contractName: "Play",
			entrypoint: "spawn",
			calldata: [playerName],
		};
	};

	const Play_spawn = async (snAccount: Account | AccountInterface, playerName: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_Play_spawn_calldata(playerName),
				"GRIMBLOCK",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		Play: {
			create: Play_create,
			buildCreateCalldata: build_Play_create_calldata,
			place: Play_place,
			buildPlaceCalldata: build_Play_place_calldata,
			rename: Play_rename,
			buildRenameCalldata: build_Play_rename_calldata,
			spawn: Play_spawn,
			buildSpawnCalldata: build_Play_spawn_calldata,
		},
	};
}