<template>
  <div id="app">
    <router-view />
    <b-modal
      id="new-project-modal"
      scrollable
      title="Nouveau projet"
      title-tag="h5"
      size="md"
      @ok="createNewProject"
    >
      <b-form @submit="onSubmit">
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
    ipcRenderer.send("app-loaded");
  },

  methods: {
    createNewProject() {
      ipcRenderer.send("project-created", this.projectName);
    },
    onSubmit() {},
  },
};
</script>
