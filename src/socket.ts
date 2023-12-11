import { Server } from "socket.io";
import http from "http";
import app from "./app";
import serverConfig from "./globals/config/server.config";
import { USER_ROLES, UserDocument } from "./v1/modules/user/user.types";
import userRepository from "./v1/modules/user/user.repository";
import { DisposerStore, ReportStore, UserStore } from "./socket-store";

const SOCKET_EVENTS = {
  REPORT_BIN_FULL: "BIN.REPORT_FULL",
  BIN_REPORTS: "BIN.NUM_REPORTS",
  BIN_DISPOSAL: "BIN.ON_DISPOSAL",
  BIN_EMPTY: "BIN.ON_EMPTY",
  DISPOSER_LOGIN: "DISPOSER_LOGIN",
  USER_LOGIN: "USER_LOGIN",
  LOGOUT: "LOGOUT",
  DISCONNECT: "disconnect",
  CONNECTION: "connection",
} as const;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [serverConfig.CLIENT_BASE_URL, "http://localhost:3000"],
    credentials: true,
  },
});

io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
  // disposer login
  socket.on(SOCKET_EVENTS.DISPOSER_LOGIN, async (disposerId: string) => {
    let user: UserDocument | null;
    try {
      user = await userRepository.findById(disposerId);
      if (!user || user.role !== USER_ROLES.DISPOSER) {
        socket.disconnect();
      }
    } catch (err) {
      socket.disconnect();
    }

    console.log(`disposer ${disposerId} logged in`);
    DisposerStore.set(disposerId, socket.id);

    // send report status of all bins to disposer
    Array.from(ReportStore.keys()).forEach((binId) => {
      const totalReports = ReportStore.get(binId)?.length || 0;

      Array.from(DisposerStore.values()).forEach((socketId) => {
        socket
          .to(socketId)
          .emit(SOCKET_EVENTS.BIN_REPORTS, { binId, totalReports });
      });
    });
  });

  // user login
  socket.on(SOCKET_EVENTS.USER_LOGIN, (userId: string) => {
    console.log(`user ${userId} logged in`);
    UserStore.set(userId, socket.id);

    Array.from(ReportStore.keys()).forEach((binId) => {
      const totalReports = ReportStore.get(binId)?.length || 0;

      socket
        .to(socket.id)
        .emit(SOCKET_EVENTS.BIN_REPORTS, { binId, totalReports });
    });
  });

  // user reporting bin as full
  socket.on(
    SOCKET_EVENTS.REPORT_BIN_FULL,
    async (userId: string, binId: string) => {
      if (!UserStore.has(userId)) {
        return;
      }

      let totalReports: number = 0;

      // if no previous reports for bin
      if (!ReportStore.has(binId)) {
        let reporters: string[] = [];
        reporters.push(userId);
        ReportStore.set(binId, reporters);
        ++totalReports;
      } else {
        // if previous reports for bin
        let reporters = ReportStore.get(binId)!;

        // if user has already reported bin
        if (!reporters.includes(userId)) {
          reporters.push(userId);
        } else {
          return;
        }

        totalReports = reporters.length;
      }

      console.log(`bin ${binId} marked as full by user ${userId}`);

      // alert disposer
      Array.from(DisposerStore.values()).forEach((socketId) => {
        socket
          .to(socketId)
          .emit(SOCKET_EVENTS.BIN_REPORTS, { binId, totalReports });
      });
    }
  );

  // disposer marking bin for disposal
  socket.on(
    SOCKET_EVENTS.BIN_DISPOSAL,
    async (disposerId: string, binId: string) => {
      if (!DisposerStore.has(disposerId)) {
        socket.disconnect();
      }

      console.log(`bin ${binId} marked for disposal by disposer ${disposerId}`);

      Array.from(UserStore.values()).forEach((socketId) => {
        socket.to(socketId).emit(SOCKET_EVENTS.BIN_DISPOSAL, binId);
      });
    }
  );

  // disposer marking bin as empty
  socket.on(
    SOCKET_EVENTS.BIN_EMPTY,
    async (disposerId: string, binId: string) => {
      if (!DisposerStore.has(disposerId)) {
        socket.disconnect();
      }

      console.log(`bin ${binId} emptied by disposer ${disposerId}`);

      if (ReportStore.has(binId)) {
        ReportStore.delete(binId);
      }

      Array.from(UserStore.values()).forEach((socketId) => {
        socket.to(socketId).emit(SOCKET_EVENTS.BIN_EMPTY, binId);
      });
    }
  );

  socket.on(SOCKET_EVENTS.LOGOUT, (userId: string) => {
    if (typeof userId !== "string") return;
    console.log(`user ${userId} logged out`);

    if (UserStore.has(userId)) {
      UserStore.delete(userId);
    }

    if (DisposerStore.has(userId)) {
      DisposerStore.delete(userId);
    }

    if (DisposerStore.has(userId)) {
      DisposerStore.delete(userId);
    }
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    let entry = Array.from(DisposerStore.entries()).find(
      (entry) => entry[1] === socket.id
    );

    if (entry) {
      console.log(`disposer ${entry[1]} disconnect`);
      DisposerStore.delete(entry[0]);
      return;
    }

    entry = Array.from(UserStore.entries()).find(
      (entry) => entry[1] === socket.id
    );

    if (entry) {
      console.log(`user ${entry[1]} disconnect`);
      UserStore.delete(entry[0]);
      return;
    }
  });
});

export default server;
