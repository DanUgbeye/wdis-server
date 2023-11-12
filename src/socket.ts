import { Server } from "socket.io";
import http from "http";
import app from "./app";
import serverConfig from "./globals/config/server.config";
import { UserDocument } from "./v1/modules/user/user.types";
import userRepository from "./v1/modules/user/user.repository";

const SOCKET_EVENTS = {
  REPORT_BIN_FULL: "BIN.REPORT_FULL",
  BIN_REPORTS: "BIN.NUM_REPORTS",
  BIN_DISPOSAL: "BIN.ON_DISPOSAL",
  BIN_EMPTY: "BIN.ON_EMPTY",
  ADMIN_LOGIN: "ADMIN_LOGIN",
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

const AdminStore = new Map<string, string>();
const UserStore = new Map<string, string>();
const ReportStore = new Map<string, string[]>();

io.on("connection", (socket) => {
  // admin login
  socket.on(SOCKET_EVENTS.ADMIN_LOGIN, async (adminId: string) => {
    let user: UserDocument | null;
    try {
      user = await userRepository.findById(adminId);
      if (!user || user.role !== "admin") {
        socket.disconnect();
      }
    } catch (err) {
      socket.disconnect();
    }

    AdminStore.set(adminId, socket.id);
  });

  // student login
  socket.on(SOCKET_EVENTS.USER_LOGIN, (userId: string) => {
    UserStore.set(userId, socket.id);
  });

  // stdents reporting bin as full
  socket.on(
    SOCKET_EVENTS.REPORT_BIN_FULL,
    async (userId: string, binId: string) => {
      if (!UserStore.has(userId)) {
        return;
      }

      let totalReports: number = 0;

      if (!ReportStore.has(binId)) {
        let reporters: string[] = [];
        reporters.push(userId);
        ReportStore.set(binId, reporters);
        ++totalReports;
      } else {
        let reporters = ReportStore.get(binId)!;
        if (!reporters.includes(userId)) {
          reporters.push(userId);
        } else {
          return;
        }

        totalReports = reporters.length;
      }

      Array.from(UserStore.values()).forEach((socketId) => {
        socket
          .to(socketId)
          .emit(SOCKET_EVENTS.BIN_REPORTS, { binId, totalReports });
      });
    }
  );

  // admin marking bin for disposal
  socket.on(
    SOCKET_EVENTS.BIN_DISPOSAL,
    async (adminId: string, binId: string) => {
      if (!AdminStore.has(adminId)) {
        socket.disconnect();
      }

      Array.from(UserStore.values()).forEach((socketId) => {
        socket.to(socketId).emit(SOCKET_EVENTS.BIN_DISPOSAL, binId);
      });
    }
  );

  // admin marking bin as empty
  socket.on(SOCKET_EVENTS.BIN_EMPTY, async (adminId: string, binId: string) => {
    if (!AdminStore.has(adminId)) {
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

    if (AdminStore.has(userId)) {
      AdminStore.delete(userId);
    }
  });
});

export default server;
