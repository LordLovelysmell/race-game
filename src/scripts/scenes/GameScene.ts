import { Scene } from "phaser";
import { RaceTrack } from "../classes/RaceTrack";
import { Player } from "../classes/Player";
import { Stats } from "../classes/Stats";
import { StatsPanel } from "../classes/StatsPanel";
import { StatsPopup } from "../classes/StatsPopup";

class GameScene extends Scene {
  private _raceTrack: RaceTrack;
  private _player: Player;
  private _totalLaps = 3;
  private _stats: Stats;
  private _statsPanel: StatsPanel;

  constructor() {
    super("Game");
  }

  preload() {
    this.add.sprite(0, 0, "bg").setOrigin(0, 0);
  }

  create() {
    this._raceTrack = new RaceTrack(this);
    this._player = new Player({ raceTrack: this._raceTrack, scene: this });
    this._stats = new Stats({ totalLaps: this._totalLaps });
    this._statsPanel = new StatsPanel({
      stats: this._stats.statistics,
      scene: this,
    });

    this._player.car.on("newlap", this._onLapComplete, this);
  }

  update(time: number, deltaTime: number) {
    if (this._stats.wasRaceComplete) {
      return;
    }

    this._stats.update(deltaTime);
    this._statsPanel.render(this._stats.statistics);
    this._player.move(deltaTime / 1000);
  }

  private _onLapComplete(lap: number) {
    this._stats.onLapComplete();

    if (this._stats.wasRaceComplete) {
      const statsPopup = new StatsPopup({
        scene: this,
        stats: this._stats.statistics,
      });
    }
  }
}

export { GameScene };
