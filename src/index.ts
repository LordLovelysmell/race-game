import { AUTO, Game, Scale, Types } from "phaser";
import { BootScene } from "./scripts/scenes/BootScene";
import { GameScene } from "./scripts/scenes/GameScene";
import { PreloadScene } from "./scripts/scenes/PreloadScene";

import "./index.scss";

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: 1280,
  height: 720,
  scene: [BootScene, PreloadScene, GameScene],
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  physics: {
    default: "matter",
    matter: {
      // debug: true,
      gravity: { x: 0, y: 0 },
    },
  },
};

const game = new Game(config);
