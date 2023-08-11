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
  private _speed = 600;
  private _acceleration = 2;
  private _currentVelocity = 0;
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
    return (
      this._playerCar.angle +
      this._turn *
        Math.max(Math.abs(this._currentVelocity - this._speed) / 450, 1)
    );
  }

  private get _velocity() {
    const speed = Math.abs(this._currentVelocity);

    if (this._direction !== DIRECTIONS.NONE && speed < this._maxSpeed) {
      this._currentVelocity += this._acceleration * Math.sign(this._direction);
    } else if (speed > this._maxSpeed || speed > 0) {
      console.log("stopping");

      this._currentVelocity -=
        this._acceleration * Math.sign(this._currentVelocity) * 0.75;
    }

    if (this._direction === DIRECTIONS.BACKWARD && this._currentVelocity > 0) {
      console.log("braking");

      this._currentVelocity -=
        this._acceleration *
        Math.max(Math.abs(this._currentVelocity - this._maxSpeed) / 300, 2);
    }

    return this._currentVelocity;
  }

  private _getVelocityFromAngle(): PhaserMath.Vector2 {
    return new PhaserMath.Vector2().setToPolar(
      this._playerCar.rotation - Math.PI / 2,
      this._velocity
    );
  }

  private get _maxSpeed() {
    return this._speed * this._raceTrack.getTileFriction(this._playerCar);
  }

  public move(deltaTime: number) {
    const velocity = this._getVelocityFromAngle().scale(deltaTime);
    this._playerCar.setVelocity(velocity.x, velocity.y);
    this._playerCar.setAngle(this._angle);
  }
}

export { Player };
