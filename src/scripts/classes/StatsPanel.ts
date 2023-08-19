import { Scene, Types } from "phaser";
import type { Statistics } from "./Stats";

interface StatsPanelProps {
  scene: Scene;
  stats: Statistics;
}

class StatsPanel {
  private _scene: Scene;
  private _textForBestLap: Phaser.GameObjects.Text;
  private _textForCurrentLap: Phaser.GameObjects.Text;
  private _textForTotalTime: Phaser.GameObjects.Text;
  private _textForLapsCounter: Phaser.GameObjects.Text;
  private _style: Types.GameObjects.Text.TextStyle;
  private _stats: Statistics;
  private _textBetweenGap: number;

  constructor({ scene, stats }: StatsPanelProps) {
    this._scene = scene;
    this._stats = stats;
    this._textBetweenGap = 30;

    this._style = {
      fontSize: 24,
      color: "#000",
      fontFamily: "Arial",
    };

    this._textForLapsCounter = this._scene.add
      .text(
        20,
        20,
        `Lap ${this._stats.currentLap}/${this._stats.totalLaps}`,
        this._style
      )
      .setScrollFactor(0);
    this._textForTotalTime = this._scene.add
      .text(
        20,
        50,
        `Total race time: ${this._stats.totalRaceTime}`,
        this._style
      )
      .setScrollFactor(0);
    this._textForCurrentLap = this._scene.add
      .text(
        20,
        80,
        `Current lap time: ${this._stats.currentLapTime}`,
        this._style
      )
      .setScrollFactor(0);
    this._textForBestLap = this._scene.add
      .text(20, 110, `Best lap time: ${this._stats.bestLapTime}`, this._style)
      .setScrollFactor(0);
  }

  public render({
    currentLap,
    totalLaps,
    totalRaceTime,
    currentLapTime,
    bestLapTime,
  }: Statistics) {
    this._textForLapsCounter.setText(`Lap ${currentLap}/${totalLaps}`);
    this._textForTotalTime.setText(`Total race time: ${totalRaceTime}`);
    this._textForCurrentLap.setText(`Current lap time: ${currentLapTime}`);
    this._textForBestLap.setText(`Best lap time: ${bestLapTime}`);
  }
}

export { StatsPanel };
