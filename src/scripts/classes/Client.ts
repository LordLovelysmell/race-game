import { Events } from "phaser";
import { io } from "socket.io-client";

const HOST = "http://localhost:3000";

interface Data {
  host: boolean;
}

class Client extends Events.EventEmitter {
  private _host: boolean = false;

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

    socket.on("gamestart", (data: Data) => {
      if (data && data.host) {
        this._host = data.host;
      }
      this.emit("game");
    });
  }

  get host() {
    return this._host;
  }
}

export { Client };
