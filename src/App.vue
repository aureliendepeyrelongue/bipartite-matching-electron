<template>
  <div id="app">
    <router-view />
    <b-modal
      id="new-project-modal"
      scrollable
      :title="
        udpateProjectNameOnly ? $t('app.renameProject') : $t('app.newProject')
      "
      title-tag="h5"
      size="md"
      @ok="createNewProject"
    >
      <b-form>
        <b-form-group
          id="input-group-1"
          :label="$t('app.projectName')"
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

    ipcRenderer.on("change-lang", (event, lang) => {
      this.$i18n.locale = lang;
      ipcRenderer.send("set-menu", this.getTranslations());
    });

    ipcRenderer.send("app-loaded");
    ipcRenderer.send("set-menu", this.getTranslations());
  },

  methods: {
    createNewProject() {
      if (this.udpateProjectNameOnly) {
        ipcRenderer.send("project-renamed", this.projectName);
        this.udpateProjectNameOnly = false;
      } else ipcRenderer.send("project-created", this.projectName);
      this.projectName = "";
    },
    getTranslations() {
      return {
        files: this.$t("menu.files"),
        newProject: this.$t("menu.newProject"),
        importProject: this.$t("menu.importProject"),
        save: this.$t("menu.save"),
        renameProject: this.$t("menu.renameProject"),
        window: this.$t("menu.window"),
        quit: this.$t("menu.quit"),
        languages: this.$t("menu.languages"),
        fr: this.$t("menu.fr"),
        en: this.$t("menu.en"),
        es: this.$t("menu.es"),
        zh: this.$t("menu.zh"),
        ar: this.$t("menu.ar"),
        ru: this.$t("menu.ru"),
        du: this.$t("menu.du"),
        pt: this.$t("menu.pt"),
        it: this.$t("menu.it"),
        de: this.$t("menu.de"),
      };
    },
  },
};
</script>
