import { Scene } from "phaser";
import { RaceTrack } from "../classes/RaceTrack";
import { Player } from "../classes/Player";

class GameScene extends Scene {
  private _raceTrack: RaceTrack;
  private _player: Player;
  private _maxLaps = 1;

  constructor() {
    super("Game");
  }

  preload() {
    this.add.sprite(0, 0, "bg").setOrigin(0, 0);
  }

  create() {
    this._raceTrack = new RaceTrack(this);
    this._player = new Player({ raceTrack: this._raceTrack, scene: this });

    this._player.car.on("newlap", this._onLapComplete, this);
  }

  update(time: number, deltaTime: number) {
    this._player.move(deltaTime / 1000);
  }

  private _onLapComplete(lap: number) {
    if (lap >= this._maxLaps) {
      this.scene.restart();
    }
  }
}

export { GameScene };
