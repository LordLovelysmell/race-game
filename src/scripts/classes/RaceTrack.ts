import { GameObjects, Scene, Tilemaps } from "phaser";

const GRASS_FRICTION = 0.3;
const ROADS_FRICTION = {
  road: 1,
  ground: 0.5,
  sand: 0.4,
};

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
        element.x + element.width / 2,
        element.y - element.height / 2,
        "objects",
        element.name
      );

      sprite.setStatic(true);
    });
  }

  public get playerPosition() {
    return this._tilemap.findObject("player", (element) => {
      return element.name === "player";
    });
  }

  public get tilemap() {
    return this._tilemap;
  }

  public getTileFriction(sprite: GameObjects.Sprite) {
    for (let road in ROADS_FRICTION) {
      let tile = this.tilemap.getTileAtWorldXY(
        sprite.x,
        sprite.y,
        false,
        this._scene.cameras.main,
        road
      );

      if (tile) {
        return ROADS_FRICTION[road];
      }
    }

    return GRASS_FRICTION;
  }
}

export { RaceTrack };
