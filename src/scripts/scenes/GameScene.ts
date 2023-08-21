import { Scene } from "phaser";
import { RaceTrack } from "../classes/RaceTrack";
import { Player } from "../classes/Player";
import { Stats } from "../classes/Stats";
import { StatsPanel } from "../classes/StatsPanel";
import { StatsPopup } from "../classes/StatsPopup";
import type { Client, SyncData } from "../classes/Client";

export interface Car {
  sprite: string;
  position: string;
}

interface CarsConfig {
  player: Car;
  opponent: Car;
}

interface SceneData {
  client: Client;
}

const CARS = {
  BLUE: {
    sprite: "car_blue_1",
    position: "player",
  },
  RED: {
    sprite: "car_red_1",
    position: "enemy",
  },
};

class GameScene extends Scene {
  private _raceTrack: RaceTrack;
  private _player: Player;
  private _totalLaps = 3;
  private _stats: Stats;
  private _statsPanel: StatsPanel;
  private _client: Client;
  private _opponent: Player | null;

  constructor() {
    super("Game");
  }

  preload() {
    this.add.sprite(0, 0, "bg").setOrigin(0, 0);
  }

  create(data: SceneData) {
    if (data && data.client) {
      this._client = data.client;
    }

    this._raceTrack = new RaceTrack(this);

    const car = this._getCarsConfig();
    this._player = new Player({
      raceTrack: this._raceTrack,
      car: car.player,
      scene: this,
    });

    if (this._client) {
      this._opponent = new Player({
        raceTrack: this._raceTrack,
        car: car.opponent,
        scene: this,
        isOpponent: true,
      });

      this._client.on("data", (data: SyncData) => {
        this._opponent.car.setX(data.x);
        this._opponent.car.setY(data.y);
        this._opponent.car.setAngle(data.angle);
      });
    }

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

    this._sync();
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

  private _getCarsConfig(): CarsConfig {
    const config = {
      player: CARS.BLUE,
      opponent: CARS.RED,
    };

    if (this._client && !this._client.host) {
      config.player = CARS.RED;
      config.opponent = CARS.BLUE;
    }

    return config;
  }

  private _sync() {
    if (this._client) {
      this._client.send({
        x: this._player.car.x,
        y: this._player.car.y,
        angle: this._player.car.angle,
      });
    }
  }
}

export { GameScene };
