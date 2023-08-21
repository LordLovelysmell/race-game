import { Scene, Math as PhaserMath, Types } from "phaser";
import type { RaceTrack } from "./RaceTrack";
import { Checkpoint } from "./Checkpoint";
import type { Car } from "../scenes/GameScene";

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
  car: Car;
  isOpponent?: boolean;
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
  private _isInCollision: boolean = false;
  private _lastCheckpoint = 0;
  private _currentLap: number = 0;

  constructor({ raceTrack, car, isOpponent, scene }: PlayerProps) {
    this._raceTrack = raceTrack;
    this._scene = scene;

    const position = this._raceTrack.getPlayerPosition(car.position);

    this._playerCar = this._scene.matter.add.sprite(
      position.x,
      position.y,
      "objects",
      car.sprite
    );

    this._playerCar.setFixedRotation();

    this._playerCar.setName(car.sprite);

    this._playerCar.setOnCollideActive(
      ({
        bodyA,
        bodyB,
        isSensor,
      }: Types.Physics.Matter.MatterCollisionPair) => {
        if (
          bodyA.gameObject.frame.name === "oil" &&
          bodyB.gameObject.name === this._playerCar.name
        ) {
          this.slide();
        }
        if (this._currentVelocity !== 0 && !isSensor) {
          this._currentVelocity /= 1.5;
          this._isInCollision = true;
        }
      }
    );

    this._playerCar.setOnCollideEnd(() => {
      this._isInCollision = false;
    });

    this._cursors = this._scene.input.keyboard.createCursorKeys();

    if (!isOpponent) {
      this._setUpCamera();
    }
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
    if (Math.abs(this._velocity) < 10 && !this._isInCollision) {
      return TURNS.NONE;
    }

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
      // stopping

      this._currentVelocity -=
        this._acceleration * Math.sign(this._currentVelocity) * 0.75;
    }

    if (this._direction === DIRECTIONS.BACKWARD && this._currentVelocity > 0) {
      // braking

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
    this._checkPosition();
  }

  public slide() {
    if (Math.abs(this._currentVelocity) > 150) {
      this._playerCar.setAngle(
        this._playerCar.angle -
          (Math.sign(Math.round(Math.random() * 2 - 1)) *
            Math.abs(this._currentVelocity)) /
            100
      );
    }
  }

  private _checkPosition() {
    const checkpoint = this._raceTrack.checkpoints.find((checkpoint) =>
      checkpoint.contains(this._playerCar.x, this._playerCar.y)
    );

    if (checkpoint) {
      this._onCheckpoint(checkpoint);
    }
  }

  private _onCheckpoint(checkpoint: Checkpoint) {
    if (checkpoint.id === this._lastCheckpoint + 1) {
      this._lastCheckpoint++;
    } else if (
      checkpoint.id === 1 &&
      this._lastCheckpoint === this._raceTrack.checkpoints.length
    ) {
      this._lastCheckpoint = 1;
      this._playerCar.emit("newlap");
    }
  }

  public get car() {
    return this._playerCar;
  }
}

export { Player };
