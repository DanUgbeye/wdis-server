import { Server } from "socket.io";
import http from "http";
import app from "./app";
import serverConfig from "./globals/config/server.config";
import { USER_ROLES, UserDocument } from "./v1/modules/user/user.types";
import userRepository from "./v1/modules/user/user.repository";

const SOCKET_EVENTS = {
  REPORT_BIN_FULL: "BIN.REPORT_FULL",
  BIN_REPORTS: "BIN.NUM_REPORTS",
  BIN_DISPOSAL: "BIN.ON_DISPOSAL",
  BIN_EMPTY: "BIN.ON_EMPTY",
  DISPOSER_LOGIN: "DISPOSER_LOGIN",
  USER_LOGIN: "USER_LOGIN",
  DISCONNECT: "disconnect",
} as const;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [serverConfig.CLIENT_BASE_URL],
    credentials: true,
  },
});

const DisposerStore = new Map<string, string>();
const UserStore = new Map<string, string>();
const ReportStore = new Map<string, string[]>();

io.on("connection", (socket) => {
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
    UserStore.set(userId, socket.id);
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

      Array.from(UserStore.values()).forEach((socketId) => {
        socket.to(socketId).emit(SOCKET_EVENTS.BIN_DISPOSAL, binId);
      });
    }
  );

  // disposer marking bin as empty
  socket.on(SOCKET_EVENTS.BIN_EMPTY, async (userId: string, binId: string) => {
    if (!DisposerStore.has(userId)) {
      socket.disconnect();
    }

    if (ReportStore.has(binId)) {
      ReportStore.delete(binId);
    }

    Array.from(UserStore.values()).forEach((socketId) => {
      socket.to(socketId).emit(SOCKET_EVENTS.BIN_EMPTY, binId);
    });
  });

  socket.on("disconnect", (userId: string) => {
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
});

export default server;
