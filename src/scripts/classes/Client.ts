import { Events } from "phaser";
import { Socket, io } from "socket.io-client";

const HOST = "http://localhost:3000";

interface Data {
  host: boolean;
}

export interface SyncData {
  x: number;
  y: number;
  angle: number;
}

class Client extends Events.EventEmitter {
  private _host: boolean = false;
  private _socket: Socket;
  private _sent: SyncData;

  constructor() {
    super();
  }

  public init() {
    this._socket = io(HOST);

    this._socket.on("connect", () => {
      console.log("Client connected");
    });

    this._socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    this._socket.on("gamestart", (data: Data) => {
      if (data && data.host) {
        this._host = data.host;
      }
      this.emit("game");
    });

    this._socket.on("opponentmove", (data: SyncData) => {
      this.emit("data", data);
    });
  }

  public send(syncData: SyncData) {
    if (JSON.stringify(this._sent) === JSON.stringify(syncData)) {
      return;
    }

    this._socket.emit("playermove", syncData);
    this._sent = syncData;
  }

  get host() {
    return this._host;
  }
}

export { Client };
