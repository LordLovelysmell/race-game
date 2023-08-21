import type { Server as IServer } from "http";
import { Server, Socket } from "socket.io";

interface Session {
  playerSocket: Socket;
  opponentSocket: Socket;
}

class SocketManager {
  private _sessions: Session[] = [];

  constructor(server: IServer) {
    const io = new Server(server);

    io.on("connection", (socket) => {
      this._onConnection(socket);
    });

    io.on("disconnect", (socket) => {
      console.log(`User with socket id ${socket.id} was disconnected`);
    });
  }

  private _onConnection(socket: Socket) {
    console.log(`New user connected with socket id: ${socket.id}`);

    const session = this._getPendingSession();

    if (!session) {
      this._createPendingSession(socket);
    } else {
      session.opponentSocket = socket;
      this._startGame(session);
    }
  }

  private _getPendingSession() {
    return this._sessions.find(
      (session) => session.playerSocket && !session.opponentSocket
    );
  }
  private _createPendingSession(socket: Socket) {
    const sessionData: Session = {
      playerSocket: socket,
      opponentSocket: null,
    };

    this._sessions.push(sessionData);
  }

  private _startGame(session: Session) {
    session.playerSocket.emit("gamestart", { host: true });
    session.opponentSocket.emit("gamestart");
  }
}

export { SocketManager };
