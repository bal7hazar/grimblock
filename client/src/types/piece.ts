// Orientation enum matching contracts/src/types/orientation.cairo
export enum OrientationType {
  None = "None",
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right",
}

// Piece enum matching contracts/src/types/piece.cairo
export enum PieceType {
  None = "None",
  BigBoy = "BigBoy",
  BlueRicky = "BlueRicky",
  ClevelandZ = "ClevelandZ",
  Corner = "Corner",
  Domino = "Domino",
  Hero = "Hero",
  LargeCorner = "LargeCorner",
  OrangeRicky = "OrangeRicky",
  RhodeIsland = "RhodeIsland",
  Smashboy = "Smashboy",
  SuperHero = "SuperHero",
  Tallboy = "Tallboy",
  Teewee = "Teewee",
  Triomino = "Triomino",
}

export const PIECE_COUNT = 14;
export const ORIENTATION_COUNT = 4;

export class Orientation {
  value: OrientationType;

  constructor(value: OrientationType) {
    this.value = value;
  }

  public into(): number {
    return Object.values(OrientationType).indexOf(this.value);
  }

  public static from(index: number): Orientation {
    const item = Object.values(OrientationType)[index];
    return new Orientation(item);
  }

  public isNone(): boolean {
    return this.value === OrientationType.None;
  }

  public name(): string {
    return this.value;
  }
}

export class Piece {
  value: PieceType;

  constructor(value: PieceType) {
    this.value = value;
  }

  public into(): number {
    switch (this.value) {
      case PieceType.None:
        return 0;
      case PieceType.BigBoy:
        return 1;
      case PieceType.BlueRicky:
        return 2;
      case PieceType.ClevelandZ:
        return 3;
      case PieceType.Corner:
        return 4;
      case PieceType.Domino:
        return 5;
      case PieceType.Hero:
        return 6;
      case PieceType.LargeCorner:
        return 7;
      case PieceType.OrangeRicky:
        return 8;
      case PieceType.RhodeIsland:
        return 9;
      case PieceType.Smashboy:
        return 10;
      case PieceType.SuperHero:
        return 11;
      case PieceType.Tallboy:
        return 12;
      case PieceType.Teewee:
        return 13;
      case PieceType.Triomino:
        return 14;
      default:
        return 0;
    }
  }

  public static from(index: number): Piece {
    const types = Object.values(PieceType);
    return new Piece(types[index] || PieceType.None);
  }

  public isNone(): boolean {
    return this.value === PieceType.None;
  }

  public index(): number {
    return this.into();
  }

  public name(): string {
    switch (this.value) {
      case PieceType.BigBoy:
        return "Big Boy";
      case PieceType.BlueRicky:
        return "Blue Ricky";
      case PieceType.ClevelandZ:
        return "Cleveland Z";
      case PieceType.Corner:
        return "Corner";
      case PieceType.Domino:
        return "Domino";
      case PieceType.Hero:
        return "Hero";
      case PieceType.LargeCorner:
        return "Large Corner";
      case PieceType.OrangeRicky:
        return "Orange Ricky";
      case PieceType.RhodeIsland:
        return "Rhode Island";
      case PieceType.Smashboy:
        return "Smashboy";
      case PieceType.SuperHero:
        return "Super Hero";
      case PieceType.Tallboy:
        return "Tallboy";
      case PieceType.Teewee:
        return "Teewee";
      case PieceType.Triomino:
        return "Triomino";
      default:
        return "";
    }
  }

  public description(): string {
    switch (this.value) {
      case PieceType.BigBoy:
        return "A massive 3x3 block, the ultimate space filler";
      case PieceType.BlueRicky:
        return "L-shaped piece, perfect for corners";
      case PieceType.ClevelandZ:
        return "Z-shaped piece for those tricky spots";
      case PieceType.Corner:
        return "Small L corner, compact and versatile";
      case PieceType.Domino:
        return "Simple 2-block piece, easy to place";
      case PieceType.Hero:
        return "Classic I-piece with 4 blocks in a row";
      case PieceType.LargeCorner:
        return "Extended L corner for bigger combos";
      case PieceType.OrangeRicky:
        return "Reverse L-shaped piece";
      case PieceType.RhodeIsland:
        return "S-shaped piece, zigzag your way to victory";
      case PieceType.Smashboy:
        return "Solid 2x2 square block";
      case PieceType.SuperHero:
        return "Extended I-piece with 5 blocks";
      case PieceType.Tallboy:
        return "Tall 3x2 rectangle";
      case PieceType.Teewee:
        return "T-shaped piece, great for filling gaps";
      case PieceType.Triomino:
        return "3-block line piece";
      default:
        return "";
    }
  }

  public score(): number {
    switch (this.value) {
      case PieceType.None:
        return 0;
      case PieceType.BigBoy:
        return 9;
      case PieceType.BlueRicky:
        return 4;
      case PieceType.ClevelandZ:
        return 4;
      case PieceType.Corner:
        return 3;
      case PieceType.Domino:
        return 2;
      case PieceType.Hero:
        return 4;
      case PieceType.LargeCorner:
        return 5;
      case PieceType.OrangeRicky:
        return 4;
      case PieceType.RhodeIsland:
        return 4;
      case PieceType.Smashboy:
        return 4;
      case PieceType.SuperHero:
        return 5;
      case PieceType.Tallboy:
        return 6;
      case PieceType.Teewee:
        return 4;
      case PieceType.Triomino:
        return 3;
      default:
        return 0;
    }
  }

  public size(orientation: Orientation): [number, number] {
    switch (this.value) {
      case PieceType.None:
        return [0, 0];
      case PieceType.BigBoy:
        return [3, 3];
      case PieceType.BlueRicky:
      case PieceType.ClevelandZ:
      case PieceType.OrangeRicky:
      case PieceType.RhodeIsland:
        return orientation.value === OrientationType.Up ||
          orientation.value === OrientationType.Down
          ? [2, 3]
          : [3, 2];
      case PieceType.Corner:
        return [2, 2];
      case PieceType.Domino:
        return orientation.value === OrientationType.Up ||
          orientation.value === OrientationType.Down
          ? [2, 1]
          : [1, 2];
      case PieceType.Hero:
        return orientation.value === OrientationType.Up ||
          orientation.value === OrientationType.Down
          ? [4, 1]
          : [1, 4];
      case PieceType.LargeCorner:
        return [3, 3];
      case PieceType.Smashboy:
        return [2, 2];
      case PieceType.SuperHero:
        return orientation.value === OrientationType.Up ||
          orientation.value === OrientationType.Down
          ? [5, 1]
          : [1, 5];
      case PieceType.Tallboy:
        return orientation.value === OrientationType.Up ||
          orientation.value === OrientationType.Down
          ? [3, 2]
          : [2, 3];
      case PieceType.Teewee:
        return orientation.value === OrientationType.Up ||
          orientation.value === OrientationType.Down
          ? [2, 3]
          : [3, 2];
      case PieceType.Triomino:
        return orientation.value === OrientationType.Up ||
          orientation.value === OrientationType.Down
          ? [3, 1]
          : [1, 3];
      default:
        return [0, 0];
    }
  }

  public get(orientation: Orientation): bigint {
    switch (this.value) {
      case PieceType.None:
        return 0n;
      case PieceType.BigBoy:
        return 0b00000111_00000111_00000111n;
      case PieceType.BlueRicky:
        switch (orientation.value) {
          case OrientationType.Up:
            return 0b00000100_00000111n;
          case OrientationType.Down:
            return 0b00000111_00000001n;
          case OrientationType.Left:
            return 0b00000001_00000001_00000011n;
          case OrientationType.Right:
            return 0b00000011_00000010_00000010n;
          default:
            return 0n;
        }
      case PieceType.ClevelandZ:
        switch (orientation.value) {
          case OrientationType.Up:
          case OrientationType.Down:
            return 0b00000110_00000011n;
          case OrientationType.Left:
          case OrientationType.Right:
            return 0b00000001_00000011_00000010n;
          default:
            return 0n;
        }
      case PieceType.Corner:
        switch (orientation.value) {
          case OrientationType.Up:
            return 0b00000001_00000011n;
          case OrientationType.Down:
            return 0b00000011_00000010n;
          case OrientationType.Left:
            return 0b00000011_00000001n;
          case OrientationType.Right:
            return 0b00000010_00000011n;
          default:
            return 0n;
        }
      case PieceType.Domino:
        switch (orientation.value) {
          case OrientationType.Up:
          case OrientationType.Down:
            return 0b00000001_00000001n;
          case OrientationType.Left:
          case OrientationType.Right:
            return 0b00000011n;
          default:
            return 0n;
        }
      case PieceType.Hero:
        switch (orientation.value) {
          case OrientationType.Up:
          case OrientationType.Down:
            return 0b00000001_00000001_00000001_00000001n;
          case OrientationType.Left:
          case OrientationType.Right:
            return 0b00001111n;
          default:
            return 0n;
        }
      case PieceType.LargeCorner:
        switch (orientation.value) {
          case OrientationType.Up:
            return 0b00000001_00000001_00000111n;
          case OrientationType.Down:
            return 0b00000111_00000100_00000100n;
          case OrientationType.Left:
            return 0b00000111_00000001_00000001n;
          case OrientationType.Right:
            return 0b00000100_00000100_00000111n;
          default:
            return 0n;
        }
      case PieceType.OrangeRicky:
        switch (orientation.value) {
          case OrientationType.Up:
            return 0b00000001_00000111n;
          case OrientationType.Down:
            return 0b00000111_00000100n;
          case OrientationType.Left:
            return 0b00000011_00000001_00000001n;
          case OrientationType.Right:
            return 0b00000010_00000010_00000011n;
          default:
            return 0n;
        }
      case PieceType.RhodeIsland:
        switch (orientation.value) {
          case OrientationType.Up:
          case OrientationType.Down:
            return 0b00000011_00000110n;
          case OrientationType.Left:
          case OrientationType.Right:
            return 0b00000010_00000011_00000001n;
          default:
            return 0n;
        }
      case PieceType.Smashboy:
        return 0b00000011_00000011n;
      case PieceType.SuperHero:
        switch (orientation.value) {
          case OrientationType.Up:
          case OrientationType.Down:
            return 0b00000001_00000001_00000001_00000001_00000001n;
          case OrientationType.Left:
          case OrientationType.Right:
            return 0b00011111n;
          default:
            return 0n;
        }
      case PieceType.Tallboy:
        switch (orientation.value) {
          case OrientationType.Up:
          case OrientationType.Down:
            return 0b00000011_00000011_00000011n;
          case OrientationType.Left:
          case OrientationType.Right:
            return 0b00000111_00000111n;
          default:
            return 0n;
        }
      case PieceType.Teewee:
        switch (orientation.value) {
          case OrientationType.Up:
            return 0b00000010_00000111n;
          case OrientationType.Down:
            return 0b00000111_00000010n;
          case OrientationType.Left:
            return 0b00000001_00000011_00000001n;
          case OrientationType.Right:
            return 0b00000010_00000011_00000010n;
          default:
            return 0n;
        }
      case PieceType.Triomino:
        switch (orientation.value) {
          case OrientationType.Up:
          case OrientationType.Down:
            return 0b00000001_00000001_00000001n;
          case OrientationType.Left:
          case OrientationType.Right:
            return 0b00000111n;
          default:
            return 0n;
        }
      default:
        return 0n;
    }
  }

  public color(): string {
    switch (this.value) {
      case PieceType.BigBoy:
        return "#FF6B6B";
      case PieceType.BlueRicky:
        return "#4ECDC4";
      case PieceType.ClevelandZ:
        return "#45B7D1";
      case PieceType.Corner:
        return "#FFA07A";
      case PieceType.Domino:
        return "#98D8C8";
      case PieceType.Hero:
        return "#F7DC6F";
      case PieceType.LargeCorner:
        return "#BB8FCE";
      case PieceType.OrangeRicky:
        return "#F39C12";
      case PieceType.RhodeIsland:
        return "#52C97E";
      case PieceType.Smashboy:
        return "#E74C3C";
      case PieceType.SuperHero:
        return "#3498DB";
      case PieceType.Tallboy:
        return "#9B59B6";
      case PieceType.Teewee:
        return "#1ABC9C";
      case PieceType.Triomino:
        return "#E67E22";
      default:
        return "#95A5A6";
    }
  }
}
