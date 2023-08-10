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

    this._createLayers();
    this._createCollisions();
  }

  private _createLayers() {
    this._tilemap.createLayer("grass", this._tileset);
    this._tilemap.createLayer("ground", this._tileset);
    this._tilemap.createLayer("sand", this._tileset);
    this._tilemap.createLayer("road", this._tileset);
  }

  private _createCollisions() {
    const collisionLayer = this._tilemap.getObjectLayer("collisions");

    collisionLayer.objects.forEach((element) => {
      const sprite = this._scene.matter.add.sprite(
        element.x,
        element.y,
        "objects",
        element.name
      );

      sprite.setOrigin(0, 1);
      sprite.setStatic(true);
    });
  }
}

export { RaceTrack };
