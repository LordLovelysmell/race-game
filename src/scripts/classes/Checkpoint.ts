import { Geom } from "phaser";

interface CheckpointProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

class Checkpoint extends Geom.Rectangle {
  private _id: number;

  constructor({ id, x, y, width, height }: CheckpointProps) {
    super(x, y, width, height);

    this._id = id;
  }

  public get id() {
    return this._id;
  }
}

export { Checkpoint };
