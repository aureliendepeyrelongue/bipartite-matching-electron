"use strict";

import { app, Menu, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
import ProjectManager from "./electron/ProjectManager";
import parseCSV from "./electron/parseCSV";
import fs from "fs";
import path from "path";
import { constantCase } from "constant-case";
import removeAccents from "remove-accents";
const { Parser } = require("json2csv");
import validateConstraintContent from "./electron/chevrotain/validateConstraintContent";

import MatchingProcess from "./electron/matching/MatchingProcess";

const pm = new ProjectManager("Default project");

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);
const sendProjectToView = (win) => {
  win.webContents.send("project-updated", pm.base);
};

const createMenu = (win) => {
  const template = [
    {
      label: "Fichiers",
      submenu: [
        {
          label: "Nouveau projet",
          click() {
            win.webContents.send("create-new-project", pm.base);
          },
        },
        {
          label: "Importer un projet",
          async click() {
            const result = await dialog.showOpenDialog({
              properties: ["openFile"],
              filters: [{ name: "Project", extensions: ["bmatch"] }],
            });
            const data = fs.readFileSync(result.filePaths[0]);
            pm.base = JSON.parse(data);
            sendProjectToView(win);
          },
        },

        {
          label: "Enregistrer",
          async click() {
            try {
              const result = await dialog.showOpenDialog({
                properties: ["openDirectory"],
              });
              let filePath = path.join(
                result.filePaths[0],
                `${constantCase(
                  removeAccents(pm.base.name)
                ).toLowerCase()}.bmatch`
              );
              const data = fs.writeFileSync(filePath, JSON.stringify(pm.base));
            } catch (err) {
              console.error(err);
            }
          },
        },
        {
          label: "Renommer le projet",
          click() {
            win.webContents.send("rename-project");
          },
        },
      ],
    },
    {
      label: "Fenêtre",
      submenu: [{ label: "Quitter" }],
    },
    {
      label: "Langues",
      submenu: [
        { label: "Français" },
        { label: "English" },
        { label: "Espanol" },
        { label: "Chinese" },
        { label: "Arabic" },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
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
  createMenu(win);

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

const eventManager = (win) => {
  var csvFilters = [{ name: "Données", extensions: ["csv"] }];
  var matchResults = null;

  ipcMain.on("app-loaded", (event) => {
    sendProjectToView(win);
  });
  ipcMain.on("project-renamed", (event, projectName) => {
    pm.setProjectName(projectName);
    sendProjectToView(win);
  });
  ipcMain.on("project-created", (event, projectName) => {
    pm.createProject(projectName);
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
        sendProjectToView(win);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  ipcMain.on("add-constant", (event, { tableType, key, value }) => {
    const constant = pm.addTableConstant(tableType, key, value);
    sendProjectToView(win);
  });

  ipcMain.on(
    "add-constraint",
    (event, { name, type, weight, content, description }) => {
      pm.addConstraint(name, type, weight, content, description);
      //event.reply("constant-added", constant);
      sendProjectToView(win);
    }
  );
  ipcMain.on("update-columns", (event, { type, columns }) => {
    pm.updateColumns(type, columns);
    sendProjectToView(win);
  });

  ipcMain.on("csv-export", async (event) => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });

      const pairsParser = new Parser({
        fields: pm.base.matchingResult.pairsColumns,
        delimiter: ";",
      });
      const pairsCSV = pairsParser.parse(pm.base.matchingResult.pairs);

      let filePathPairs = path.join(
        result.filePaths[0],
        `${constantCase(removeAccents(pm.base.name)).toLowerCase()}_pairs.csv`
      );

      const rejectedAParser = new Parser({
        fields: pm.base.tables.tableA.columns.map((c) => c.origin),
        delimiter: ";",
      });
      const rejectedACSV = rejectedAParser.parse(
        pm.base.matchingResult.rejectedA
      );

      let filePathRejectedA = path.join(
        result.filePaths[0],
        `${constantCase(
          removeAccents(pm.base.name)
        ).toLowerCase()}_rejected_mentees.csv`
      );

      const rejectedBParser = new Parser({
        fields: pm.base.tables.tableB.columns.map((c) => c.origin),
        delimiter: ";",
      });
      const rejectedBCSV = rejectedBParser.parse(
        pm.base.matchingResult.rejectedB
      );

      let filePathRejectedB = path.join(
        result.filePaths[0],
        `${constantCase(
          removeAccents(pm.base.name)
        ).toLowerCase()}_rejected_mentors.csv`
      );

      fs.writeFileSync(filePathPairs, pairsCSV);
      fs.writeFileSync(filePathRejectedA, rejectedACSV);
      fs.writeFileSync(filePathRejectedB, rejectedBCSV);

      sendProjectToView(win);
    } catch (err) {
      console.log(err);
    }
  });

  ipcMain.on(
    "edit-constraint",
    (event, { id, name, type, weight, content, description }) => {
      pm.updateConstraint(id, name, type, weight, content, description);
      //event.reply("constant-added", constant);
      sendProjectToView(win);
    }
  );

  ipcMain.on("delete-constraint", (event, id) => {
    pm.deleteConstraint(id);
    sendProjectToView(win);
  });

  ipcMain.on("start-matching", (event) => {
    try {
      if (pm.base.tables.tableA.empty || pm.base.tables.tableB.empty) return;
      const mp = new MatchingProcess(
        pm.base.tables.tableA.data,
        pm.base.tables.tableB.data,
        pm.base.constraints.filter((c) => c.type === "necessary"),
        pm.base.constraints.filter((c) => c.type === "secondary")
      );
      mp.prepareConstraints();
      mp.prepareData(
        pm.base.tables.tableA.columns,
        pm.base.tables.tableB.columns
      );
      mp.startMatchingProcess();
      pm.setMatchingResult(mp.getResult());
      sendProjectToView(win);
    } catch (err) {
      console.log(err);
    }
  });

  ipcMain.on("ask-constraint-validation", (event, content) => {
    try {
      const validationResult = validateConstraintContent(
        "mentee",
        "mentor",
        content
      );
      return event.reply("constraint-validation-response", validationResult);
    } catch (err) {
      console.log(err);
    }
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
