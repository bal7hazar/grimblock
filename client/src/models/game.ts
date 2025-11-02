import type { ParsedEntity } from "@dojoengine/sdk";
import type { SchemaType } from "@/bindings/typescript/models.gen";
import { NAMESPACE } from "@/constants";
import { Packer } from "@/helpers/packer";
import { Orientation, Piece } from "@/types";

const MODEL_NAME = "Game";
const SUBPACK_SIZE = 8n; // Each piece is packed in 8 bits
const PIECE_SIZE = 2 ** 4;

export class GameModel {
  type = MODEL_NAME;

  constructor(
    public identifier: string,
    public player_id: string,
    public id: number,
    public streak: boolean,
    public over: boolean,
    public combo: number,
    public score: number,
    public pieces: { piece: Piece, orientation: Orientation }[],
    public grid: bigint,
    public seed: string,
    public raw_pieces: number,
  ) {
    this.identifier = identifier;
    this.player_id = player_id;
    this.id = id;
    this.streak = streak;
    this.over = over;
    this.combo = combo;
    this.score = score;
    this.pieces = pieces;
    this.grid = grid;
    this.seed = seed;
    this.raw_pieces = raw_pieces;
  }

  static from(identifier: string, model: any) {
    if (!model) return GameModel.default(identifier);
    const player_id = model.player_id;
    const id = Number(model.id);
    const streak = !!model.streak;
    const over = !!model.over;
    const combo = Number(model.combo);
    const score = Number(model.score);
    const pieces = Packer.unpack(
      BigInt(model.pieces),
      SUBPACK_SIZE,
    ).map((subpack) => {
      let piece = subpack % PIECE_SIZE;
      let orientation = Math.floor(subpack / PIECE_SIZE);
      return {
        piece: Piece.from(piece),
        orientation: Orientation.from(orientation),
      }
     });
    const grid = BigInt(model.grid);
    const seed = model.seed;
    return new GameModel(
      identifier,
      player_id,
      id,
      streak,
      over,
      combo,
      score,
      pieces,
      grid,
      seed,
      model.pieces,
    );
  }

  static default(identifier: string) {
    return new GameModel(
      identifier,
      "",
      0,
      false,
      false,
      0,
      0,
      [],
      0n,
      "",
      0,
    );
  }

  static isType(model: GameModel) {
    return model.type === MODEL_NAME;
  }

  exists() {
    return this.id !== 0;
  }

  hasStarted() {
    return this.pieces.length > 0;
  }

  isIdle(index: number): boolean {
    return (this.grid & (1n << BigInt(index))) === 0n;
  }

  clone(): GameModel {
    return new GameModel(
      this.identifier,
      this.player_id,
      this.id,
      this.streak,
      this.over,
      this.combo,
      this.score,
      [...this.pieces],
      this.grid,
      this.seed,
      this.raw_pieces,
    );
  }
}

export const Game = {
  parse: (entity: ParsedEntity<SchemaType>) => {
    return GameModel.from(
      entity.entityId,
      entity.models[NAMESPACE]?.[MODEL_NAME],
    );
  },

  getModelName: () => {
    return MODEL_NAME;
  },

  getMethods: () => [],
};
