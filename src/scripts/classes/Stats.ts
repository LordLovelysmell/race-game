import { Scene } from "phaser";

export interface Statistics {
  totalLaps: number;
  currentLap: number;
  totalRaceTime: number;
  currentLapTime: number;
  bestLapTime: number;
}

interface StatsProps {
  totalLaps: number;
}

class Stats {
  private _totalLaps: number;
  private _currentLap: number;
  private _time: number;
  private _timeForLap: number;
  private _timeForLastLap: number;
  private _timeForBestLap: number;

  constructor({ totalLaps }: StatsProps) {
    this._totalLaps = totalLaps;
    this._currentLap = 1;
    this._time = 0;
    this._timeForLap = 0;
    this._timeForLastLap = 0;
    this._timeForBestLap = 0;
  }

  get wasRaceComplete() {
    return this._currentLap > this._totalLaps;
  }

  public onLapComplete() {
    ++this._currentLap;

    if (this._timeForBestLap === 0 || this._timeForLap < this._timeForBestLap) {
      this._timeForBestLap = this._timeForLap;
    }

    this._timeForLastLap = this._timeForLap;
    this._timeForLap = 0;
  }

  public update(deltaTime: number) {
    if (this.wasRaceComplete) {
      return;
    }

    const seconds = deltaTime / 1000;
    this._time += seconds;
    this._timeForLap += seconds;
  }

  public get statistics(): Statistics {
    return {
      totalLaps: this._totalLaps,
      currentLap: this._currentLap,
      totalRaceTime: Number(this._time.toFixed(2)),
      currentLapTime: Number(this._timeForLap.toFixed(2)),
      bestLapTime: Number(this._timeForBestLap.toFixed(2)),
    };
  }
}

export { Stats };
