import { ClauseBuilder, ToriiQueryBuilder } from "@dojoengine/sdk";
import { useEntityQuery, useModels } from "@dojoengine/sdk/react";
import { createContext, useCallback, useContext, useMemo } from "react";
import type { BigNumberish } from "starknet";
import type {
  Game as GameEntity,
  Player as PlayerEntity,
} from "@/bindings";
import { NAMESPACE } from "@/constants";
import { Game, GameModel } from "@/models/game";
import { Player, PlayerModel } from "@/models/player";

type EntitiesProviderProps = {
  children: React.ReactNode;
};

type EntitiesProviderState = {
  players?: PlayerModel[];
  games?: GameModel[];
  getPlayerById: (id: BigNumberish) => PlayerModel | undefined;
  getGameById: (id: BigNumberish) => GameModel | undefined;
  getGameByPlayerId: (playerId: BigNumberish) => GameModel | undefined;
};

const EntitiesProviderContext = createContext<
  EntitiesProviderState | undefined
>(undefined);

const playersQuery = new ToriiQueryBuilder()
  .withEntityModels([`${NAMESPACE}-${Player.getModelName()}`])
  .withClause(
    new ClauseBuilder()
      .keys(
        [`${NAMESPACE}-${Player.getModelName()}`],
        [undefined],
        "FixedLen",
      )
      .build(),
  )
  .withLimit(10_000)
  .includeHashedKeys();

const gamesQuery = new ToriiQueryBuilder()
  .withEntityModels([`${NAMESPACE}-${Game.getModelName()}`])
  .withClause(
    new ClauseBuilder()
      .keys([`${NAMESPACE}-${Game.getModelName()}`], [undefined, undefined], "FixedLen")
      .build(),
  )
  .withLimit(10_000)
  .includeHashedKeys();

export function EntitiesProvider({
  children,
  ...props
}: EntitiesProviderProps) {
  useEntityQuery(playersQuery);
  useEntityQuery(gamesQuery);

  const playerItems = useModels(`${NAMESPACE}-${Player.getModelName()}`);
  const players = useMemo(() => {
    return Object.keys(playerItems).flatMap((key) => {
      const items = playerItems[key] as PlayerEntity[];
      return Object.values(items).map((entity) =>
        PlayerModel.from(key, entity),
      );
    });
  }, [playerItems]);

  const gameItems = useModels(`${NAMESPACE}-${Game.getModelName()}`);
  const games = useMemo(() => {
    return Object.keys(gameItems).flatMap((key) => {
      const items = gameItems[key] as GameEntity[];
      return Object.values(items).map((entity) =>
        GameModel.from(key, entity),
      );
    });
  }, [gameItems]);

  const getPlayerById = useCallback(
    (id: BigNumberish) => {
      return players.find((i) => i.id === id);
    },
    [players],
  );

  const getGameById = useCallback(
    (id: BigNumberish) => {
      return games.find((i) => i.id === id);
    },
    [games],
  );

  const getGameByPlayerId = useCallback(
    (playerId: BigNumberish) => {
      return games.find((i) => i.player_id === playerId);
    },
    [games],
  );

  return (
    <EntitiesProviderContext.Provider
      {...props}
      value={{
        players: players,
        games: games,
        getPlayerById,
        getGameById,
        getGameByPlayerId,
      }}
    >
      {children}
    </EntitiesProviderContext.Provider>
  );
}

export const useEntities = () => {
  const context = useContext(EntitiesProviderContext);

  if (context === undefined)
    throw new Error("useEntities must be used within a EntitiesProvider");

  return context;
};
