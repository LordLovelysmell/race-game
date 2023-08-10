import { Scene } from "phaser";

interface Config {
  boxColor: number;
  barColor: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

class LoadingBar {
  private _scene: Scene;
  private _progressBox: Phaser.GameObjects.Graphics;
  private _progressBar: Phaser.GameObjects.Graphics;
  private _config: Config;

  constructor(scene: Scene) {
    this._scene = scene;
    this._config = {
      boxColor: 0xd3d3d3,
      barColor: 0xfff8dc,
      x: this._scene.sys.canvas.width / 2 - 450,
      y: this._scene.sys.canvas.height / 2 + 250,
      width: 900,
      height: 25,
    };

    this._progressBox = this._scene.add.graphics();
    this._progressBar = this._scene.add.graphics();

    this._showProgressBox();
    this._setEvents();
  }

  private _setEvents() {
    this._scene.load.on("progress", this._showProgressBar, this);
  }

  private _showProgressBox() {
    const { x, y, width, height } = this._config;

    this._progressBox
      .fillStyle(this._config.boxColor)
      .fillRect(x, y, width, height);
  }

  private _showProgressBar(value: number) {
    const { x, y, width, height } = this._config;

    this._progressBar
      .clear()
      .fillStyle(this._config.barColor)
      .fillRect(x, y, width * value, height);
  }
}

export { LoadingBar };
