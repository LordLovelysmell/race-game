import { Events } from "phaser";
import { io } from "socket.io-client";

const HOST = "http://localhost:3000";

class Client extends Events.EventEmitter {
  constructor() {
    super();
  }

  public init() {
    const socket = io(HOST);

    socket.on("connect", () => {
      console.log("Client connected");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("gamestart", () => {
      this.emit("game");
    });
  }
}

export { Client };
