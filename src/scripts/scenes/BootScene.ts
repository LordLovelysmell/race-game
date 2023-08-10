import { Scene } from "phaser";
import bgPng from "../../assets/images/bg.png";

class BootScene extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    console.log("BootScene.preload");
    this.load.image("bg", bgPng);
  }

  create() {
    console.log("BootScene.create");
    this.scene.start("Preload");
  }
}

export { BootScene };
