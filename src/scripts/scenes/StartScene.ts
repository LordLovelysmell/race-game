import { Scene, Types } from "phaser";
import { Client } from "../classes/Client";

class StartScene extends Scene {
  private _onePlayerButton: Phaser.GameObjects.Text;
  private _twoPlayerButton: Phaser.GameObjects.Text;
  private _client: Client;

  constructor() {
    super("Start");
  }

  create() {
    this._createBackground();
    this._createButtons();
    this._setEvents();
  }

  private _createBackground() {
    this.add.sprite(0, 0, "bg").setOrigin(0);
  }

  private _createButtons() {
    const canvas = this.sys.canvas;
    const style: Types.GameObjects.Text.TextStyle = {
      fontSize: 46,
      color: "#FAFAD2",
      fontFamily: "Arial",
      fontStyle: "bold",
    };

    this._onePlayerButton = this.add
      .text(canvas.width / 2, canvas.height / 2 - 50, "ONE PLAYER", style)
      .setOrigin(0.5)
      .setInteractive();

    this._twoPlayerButton = this.add
      .text(canvas.width / 2, canvas.height / 2 + 50, "TWO PLAYER", style)
      .setOrigin(0.5)
      .setInteractive();
  }

  private _setEvents() {
    this._onePlayerButton.on("pointerdown", this._startGame, this);

    this._twoPlayerButton.on("pointerdown", this._requestGame, this);
  }

  private _startGame() {
    this.scene.start("Game", { client: this._client });
  }

  private _requestGame() {
    this._client = new Client();
    this._client.init();
    this._client.on("game", () => {
      this._startGame();
    });
  }
}

export { StartScene };
