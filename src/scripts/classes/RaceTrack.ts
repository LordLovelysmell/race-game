import { Physics, Scene, Tilemaps } from "phaser";
import { Checkpoint } from "./Checkpoint";

interface CreateObjectsFromLayerProps {
  layerName: string;
  isSensor?: boolean;
}

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
  private _checkpoints: Checkpoint[] = [];

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
    this._createObjectsFromLayer({ layerName: "collisions" });
    this._createObjectsFromLayer({ layerName: "oils", isSensor: true });
    this._createCheckpoints();
  }

  private _createLayers() {
    this._tilemap.createLayer("grass", this._tileset);
    this._tilemap.createLayer("ground", this._tileset);
    this._tilemap.createLayer("sand", this._tileset);
    this._tilemap.createLayer("road", this._tileset);
  }

  private _createObjectsFromLayer({
    layerName,
    isSensor = false,
  }: CreateObjectsFromLayerProps) {
    const layer = this._tilemap.getObjectLayer(layerName);

    layer.objects.forEach((element) => {
      const sprite = this._scene.matter.add.sprite(
        element.x + element.width / 2,
        element.y - element.height / 2,
        "objects",
        element.name
      );

      sprite.setStatic(true);
      sprite.setSensor(isSensor);
    });
  }

  private _createCheckpoints() {
    interface Property {
      name: string;
      type: string;
      value: string;
    }

    const checkpointLayer = this._tilemap.getObjectLayer("checkpoints");

    checkpointLayer.objects.forEach(({ x, y, width, height, properties }) => {
      const prop: Property = (properties as Property[]).find(
        (property) => property.name === "value"
      );

      const checkpoint = new Checkpoint({
        id: Number(prop.value),
        x,
        y,
        width,
        height,
      });

      this._checkpoints.push(checkpoint);
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

  public get checkpoints() {
    return this._checkpoints;
  }

  public getTileFriction(sprite: Physics.Matter.Sprite) {
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
