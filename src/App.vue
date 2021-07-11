<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  mounted() {
    ipcRenderer.on("project-updated", (event, base) => {
      this.$store.commit("project/SET_PROJECT_BASE", base);
    });

    ipcRenderer.send("app-loaded");
  },
};
</script>
