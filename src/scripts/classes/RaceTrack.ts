import { Scene, Tilemaps } from "phaser";

class RaceTrack {
  private _scene: Scene;
  private _tilemap: Tilemaps.Tilemap;
  private _tileset: Tilemaps.Tileset;

  constructor(scene: Scene) {
    this._scene = scene;
    this._tilemap = this._scene.make.tilemap({
      key: "tilemap",
    });

    /**
     * @param tilesetName - assets/maps/tilemap.json => tilesets[0].name
     * @param key - key of this.load.spritesheet
     */
    this._tileset = this._tilemap.addTilesetImage(
      "tileset",
      "tileset",
      64,
      64,
      0,
      1
    );

    this._tilemap.createLayer("grass", this._tileset);
    this._tilemap.createLayer("ground", this._tileset);
    this._tilemap.createLayer("sand", this._tileset);
    this._tilemap.createLayer("road", this._tileset);
  }
}

export { RaceTrack };
