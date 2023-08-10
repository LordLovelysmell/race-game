import { AUTO, Game, Scale } from "phaser";
import { BootScene } from "./scripts/scenes/BootScene";
import { GameScene } from "./scripts/scenes/GameScene";
import { PreloadScene } from "./scripts/scenes/PreloadScene";

const config = {
  type: AUTO,
  width: 1280,
  height: 720,
  scene: [BootScene, PreloadScene, GameScene],
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
};

const game = new Game(config);
