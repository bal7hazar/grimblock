import type { ParsedEntity } from "@dojoengine/sdk";
import type { SchemaType } from "@/bindings/typescript/models.gen";
import { NAMESPACE } from "@/constants";
import { shortString } from "starknet";

const MODEL_NAME = "Player";

export class PlayerModel {
  type = MODEL_NAME;

  constructor(
    public identifier: string,
    public id: string,
    public name: string,
  ) {
    this.identifier = identifier;
    this.id = id;
    this.name = name;
  }

  static from(identifier: string, model: any) {
    if (!model) return PlayerModel.default(identifier);
    const id = model.id;
    const name = shortString.decodeShortString(`0x${BigInt(model.name).toString(16)}`);
    return new PlayerModel(identifier, id, name);
  }

  static default(identifier: string) {
    return new PlayerModel(identifier, "", "");
  }

  static isType(model: PlayerModel) {
    return model.type === MODEL_NAME;
  }

  exists() {
    return this.id !== "";
  }

  clone(): PlayerModel {
    return new PlayerModel(this.identifier, this.id, this.name);
  }
}

export const Player = {
  parse: (entity: ParsedEntity<SchemaType>) => {
    return PlayerModel.from(
      entity.entityId,
      entity.models[NAMESPACE]?.[MODEL_NAME],
    );
  },

  getModelName: () => {
    return MODEL_NAME;
  },

  getMethods: () => [],
};

