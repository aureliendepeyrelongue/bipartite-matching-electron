<template>
  <div id="app">
    <router-view />
    <b-modal
      id="new-project-modal"
      scrollable
      :title="udpateProjectNameOnly ? 'Renommer le projet' : 'Nouveau projet'"
      title-tag="h5"
      size="md"
      @ok="createNewProject"
    >
      <b-form>
        <b-form-group
          id="input-group-1"
          label="Nom du projet"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="projectName"
            type="text"
            required
          ></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";
export default {
  data() {
    return {
      udpateProjectNameOnly: false,
      projectName: "",
    };
  },
  mounted() {
    ipcRenderer.on("project-updated", (event, base) => {
      this.$store.commit("project/SET_PROJECT_BASE", base);
    });
    ipcRenderer.on("create-new-project", (event, base) => {
      this.$bvModal.show("new-project-modal");
    });
    ipcRenderer.on("rename-project", (event, base) => {
      this.udpateProjectNameOnly = true;
      this.$bvModal.show("new-project-modal");
    });

    this.$i18n.locale = "en";

    ipcRenderer.send("app-loaded");
  },

  methods: {
    createNewProject() {
      if (this.udpateProjectNameOnly) {
        ipcRenderer.send("project-renamed", this.projectName);
        this.udpateProjectNameOnly = false;
      } else ipcRenderer.send("project-created", this.projectName);

      this.projectName = "";
    },
  },
};
</script>
