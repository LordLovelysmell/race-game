import { Scene, Types } from "phaser";
import type { Statistics } from "./Stats";

interface StatsPopupProps {
  scene: Scene;
  stats: Statistics;
}

class StatsPopup {
  private _scene: Scene;
  private _styleHeadline: Types.GameObjects.Text.TextStyle;
  private _styleCommonText: Types.GameObjects.Text.TextStyle;
  private _stats: Statistics;

  constructor({ scene, stats }: StatsPopupProps) {
    this._scene = scene;
    this._stats = stats;

    this._styleHeadline = {
      fontSize: 46,
      color: "#FAFAD2",
      fontFamily: "Arial",
    };

    this._styleCommonText = {
      fontSize: 30,
      color: "#FFFFFF",
      fontFamily: "Arial",
    };

    const width = 800;
    const heigh = 600;

    this._scene.add
      .graphics()
      .setScrollFactor(0)
      .fillRect(
        this._scene.sys.canvas.width / 2 - width / 2,
        this._scene.sys.canvas.height / 2 - heigh / 2,
        width,
        heigh
      )
      .fillStyle(0x000, 0.5);

    this._scene.add
      .text(
        this._scene.cameras.main.centerX,
        this._scene.cameras.main.centerY - 200,
        "Level complete!",
        this._styleHeadline
      )
      .setScrollFactor(0)
      .setOrigin(0.5);

    this._scene.add
      .text(
        this._scene.cameras.main.centerX,
        this._scene.cameras.main.centerY - 50,
        `Total time: ${this._stats.totalRaceTime}`,
        this._styleCommonText
      )
      .setScrollFactor(0)
      .setOrigin(0.5);

    this._scene.add
      .text(
        this._scene.cameras.main.centerX,
        this._scene.cameras.main.centerY + 50,
        `Best lap time: ${this._stats.bestLapTime}`,
        this._styleCommonText
      )
      .setScrollFactor(0)
      .setOrigin(0.5);

    this._scene.add
      .text(
        this._scene.cameras.main.centerX,
        this._scene.cameras.main.centerY + 200,
        "Tap to continue!",
        this._styleCommonText
      )
      .setScrollFactor(0)
      .setOrigin(0.5);

    this._scene.input.once("pointerdown", () => {
      this._scene.scene.start("Game");
    });
  }
}

export { StatsPopup };
