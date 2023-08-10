import { Scene } from "phaser";
import { LoadingBar } from "../classes/LoadingBar";
import tileSetPng from "../../assets/maps/tileset.png";
import tilemapJson from "../../assets/maps/tilemap.json";
import objectPng from "../../assets/objects/objects.png";
import objectJson from "../../assets/objects/objects.json";

class PreloadScene extends Scene {
  private _loadingBar: LoadingBar;

  constructor() {
    super("Preload");
  }

  preload() {
    console.log("PreloadScene.preload");
    this.add.sprite(0, 0, "bg").setOrigin(0, 0);
    this._loadingBar = new LoadingBar(this);

    this.load.spritesheet("tileset", tileSetPng, {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.tilemapTiledJSON("tilemap", tilemapJson);

    this.load.atlas("objects", objectPng, objectJson);
  }

  create() {
    console.log("PreloadScene.create");
    this.scene.start("Game");
  }
}

export { PreloadScene };
