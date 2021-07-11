"use strict";

import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
import ProjectManager from "./electron/ProjectManager";
import parseCSV from "./electron/parseCSV";

const pm = new ProjectManager();
// Scheme must be registered before the app is ready

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  eventManager(win);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

const sendProjectToView = (win) => {
  win.webContents.send("project-updated", pm.base);
};

const eventManager = (win) => {
  var csvFilters = [{ name: "Données", extensions: ["csv"] }];
  var matchResults = null;

  ipcMain.on("app-loaded", (event) => {
    sendProjectToView(win);
  });
  ipcMain.on("load-table-a", (event) => {
    dialog
      .showOpenDialog({
        filters: csvFilters,
        properties: ["openFile"],
      })
      .then((result) => {
        if (!result.canceled) {
          const tableAPath = result.filePaths[0];
          return parseCSV(tableAPath).then((data) => {
            return { tableAPath, data };
          });
        }
      })
      .then(({ tableAPath, data }) => {
        pm.setTable("A", tableAPath, data);
        event.reply("table-a-loaded", pm.base.tables.tableA);
        sendProjectToView(win);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  ipcMain.on("load-table-b", (event) => {
    dialog
      .showOpenDialog({
        filters: csvFilters,
        properties: ["openFile"],
      })
      .then((result) => {
        if (!result.canceled) {
          const tableBPath = result.filePaths[0];
          return parseCSV(tableBPath).then((data) => {
            return { tableBPath, data };
          });
        }
      })
      .then(({ tableBPath, data }) => {
        pm.setTable("B", tableBPath, data);
        event.reply("table-b-loaded", pm.base.tables.tableB);
        sendProjectToView(win);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  ipcMain.on("add-constant", (event, { tableType, key, value }) => {
    const constant = pm.addTableConstant(tableType, key, value);
    event.reply("constant-added", constant);
    sendProjectToView(win);
  });
};

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
