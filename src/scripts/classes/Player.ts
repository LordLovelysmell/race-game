import { Scene, Math as PhaserMath } from "phaser";
import type { RaceTrack } from "./RaceTrack";

enum DIRECTIONS {
  BACKWARD = -1,
  NONE = 0,
  FORWARD = 1,
}

enum TURNS {
  LEFT = -1,
  NONE = 0,
  RIGHT = 1,
}

interface PlayerProps {
  raceTrack: RaceTrack;
  scene: Scene;
}

class Player {
  private _raceTrack: RaceTrack;
  private _scene: Scene;
  private _playerCar: Phaser.Physics.Matter.Sprite;
  private _speed = 400;
  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor({ raceTrack, scene }: PlayerProps) {
    this._raceTrack = raceTrack;
    this._scene = scene;

    const position = this._raceTrack.playerPosition;

    this._playerCar = this._scene.matter.add.sprite(
      position.x,
      position.y,
      "objects",
      "car_blue_1"
    );

    this._playerCar.setFixedRotation();

    this._cursors = this._scene.input.keyboard.createCursorKeys();

    this._setUpCamera();
  }

  private _setUpCamera() {
    this._scene.cameras.main.setBounds(
      0,
      0,
      this._raceTrack.tilemap.widthInPixels,
      this._raceTrack.tilemap.heightInPixels
    );
    this._scene.cameras.main.startFollow(this._playerCar);
  }

  private get _direction() {
    if (this._cursors.up.isDown) {
      return DIRECTIONS.FORWARD;
    } else if (this._cursors.down.isDown) {
      return DIRECTIONS.BACKWARD;
    } else {
      return DIRECTIONS.NONE;
    }
  }

  private get _turn() {
    if (this._cursors.left.isDown) {
      return TURNS.LEFT;
    } else if (this._cursors.right.isDown) {
      return TURNS.RIGHT;
    } else {
      return TURNS.NONE;
    }
  }

  private get _angle() {
    return this._playerCar.angle + this._turn * 2.5;
  }

  private get _velocity() {
    return this._speed * this._direction;
  }

  private _getVelocityFromAngle(): PhaserMath.Vector2 {
    return new PhaserMath.Vector2().setToPolar(
      this._playerCar.rotation - Math.PI / 2,
      this._velocity
    );
  }

  public move(deltaTime: number) {
    const velocity = this._getVelocityFromAngle().scale(deltaTime);
    this._playerCar.setVelocity(velocity.x, velocity.y);
    this._playerCar.setAngle(this._angle);
  }
}

export { Player };
