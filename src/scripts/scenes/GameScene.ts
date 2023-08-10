import { Scene } from "phaser";
import { RaceTrack } from "../classes/RaceTrack";

class GameScene extends Scene {
  private _map: RaceTrack;

  constructor() {
    super("Game");
  }

  preload() {
    this.add.sprite(0, 0, "bg").setOrigin(0, 0);
  }

  create() {
    this._map = new RaceTrack(this);
  }
}

export { GameScene };
