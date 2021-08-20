<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col">
            <div class="card">
              <div class="card-body" v-if="subpage === 'home'">
                <div class="row">
                  <div class="col-sm-12 text-left">
                    <a
                      href="#"
                      class="btn btn-outline-primary waves-effect waves-light"
                      @click="addConstraint()"
                    >
                      <i class="fe-plus mr-1"></i
                      >{{ $t("constraints.addConstraints") }}
                    </a>
                  </div>
                </div>
                <div class="custom-accordion">
                  <div class="mt-4">
                    <h5 class="position-relative mb-0">
                      <a
                        v-b-toggle.taskcollapse1
                        href="javascript: void(0);"
                        class="text-dark d-block"
                      >
                        {{ $t("constraints.necessaryConstraints") }}
                        <span class="text-muted"
                          >({{ necessaryConstraints.length }})</span
                        >
                        <i class="mdi mdi-chevron-down accordion-arrow"></i>
                      </a>
                    </h5>
                    <b-collapse visible id="taskcollapse1">
                      <div
                        class="table-responsive mt-3"
                        v-if="necessaryConstraints.length"
                      >
                        <table
                          class="table table-centered table-nowrap table-borderless table-sm"
                        >
                          <thead class="thead-light">
                            <tr class>
                              <th scope="col">{{ $t("common.name") }}</th>
                              <th scope="col">{{ $t("common.preview") }}</th>
                              <th scope="col">
                                {{ $t("common.description") }}
                              </th>
                              <th scope="col" style="width: 85px">
                                {{ $t("common.actions") }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(c, index) in necessaryConstraints"
                              :key="'nc-' + index"
                            >
                              <td>{{ c.name }}</td>
                              <td>
                                {{ c.content }}
                              </td>
                              <td>
                                {{ c.description ? c.description : "--" }}
                              </td>
                              <td>
                                <ul class="list-inline table-action m-0">
                                  <li
                                    class="list-inline-item"
                                    @click="handleEditMode(c)"
                                  >
                                    <a
                                      href="javascript:void(0);"
                                      class="action-icon px-1"
                                    >
                                      <i
                                        class="mdi mdi-square-edit-outline"
                                      ></i>
                                    </a>
                                  </li>
                                  <li
                                    class="list-inline-item"
                                    @click="seeDetails(c)"
                                  >
                                    <a
                                      href="javascript:void(0);"
                                      class="action-icon px-1"
                                    >
                                      <i class="mdi mdi-eye-outline"></i>
                                    </a>
                                  </li>
                                  <li
                                    class="list-inline-item"
                                    @click="deleteConstraint(c)"
                                  >
                                    <a
                                      href="javascript:void(0);"
                                      class="action-icon px-1"
                                    >
                                      <i class="mdi mdi-delete"></i>
                                    </a>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div v-else class="mt-2">
                        <b-alert variant="info" show>
                          {{ $t("constraints.noConstraintsMessage") }}
                        </b-alert>
                      </div>
                    </b-collapse>
                  </div>

                  <div class="mt-4">
                    <h5 class="position-relative mb-0">
                      <a
                        v-b-toggle.taskcollapse2
                        href="javascript: void(0);"
                        class="text-dark d-block"
                      >
                        {{ $t("constraints.secondaryConstraints") }}
                        <span class="text-muted"
                          >({{ secondaryConstraints.length }})</span
                        >
                        <i class="mdi mdi-chevron-down accordion-arrow"></i>
                      </a>
                    </h5>
                    <b-collapse visible id="taskcollapse2">
                      <div
                        class="table-responsive mt-3"
                        v-if="secondaryConstraints.length"
                      >
                        <table
                          class="table table-centered table-nowrap table-borderless table-sm"
                        >
                          <thead class="thead-light">
                            <tr class>
                              <th scope="col">{{ $t("common.name") }}</th>
                              <th scope="col">{{ $t("common.preview") }}</th>
                              <th scope="col">
                                {{ $t("common.description") }}
                              </th>
                              <th scope="col">
                                {{ $t("constraints.weight") }}
                              </th>
                              <th scope="col" style="width: 85px">
                                {{ $t("common.actions") }}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(c, index) in secondaryConstraints"
                              :key="'nc-' + index"
                            >
                              <td>{{ c.name }}</td>
                              <td>
                                {{ c.content }}
                              </td>
                              <td>
                                {{ c.description ? c.description : "--" }}
                              </td>
                              <td>
                                {{ c.weight }}
                              </td>
                              <td>
                                <ul class="list-inline table-action m-0">
                                  <li
                                    class="list-inline-item"
                                    @click="handleEditMode(c)"
                                  >
                                    <a
                                      href="javascript:void(0);"
                                      class="action-icon px-1"
                                    >
                                      <i
                                        class="mdi mdi-square-edit-outline"
                                      ></i>
                                    </a>
                                  </li>
                                  <li
                                    class="list-inline-item"
                                    @click="seeDetails(c)"
                                  >
                                    <a
                                      href="javascript:void(0);"
                                      class="action-icon px-1"
                                    >
                                      <i class="mdi mdi-eye-outline"></i>
                                    </a>
                                  </li>
                                  <li
                                    class="list-inline-item"
                                    @click="deleteConstraint(c)"
                                  >
                                    <a
                                      href="javascript:void(0);"
                                      class="action-icon px-1"
                                    >
                                      <i class="mdi mdi-delete"></i>
                                    </a>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div v-else class="mt-2">
                        <b-alert variant="info" show>
                          {{ $t("constraints.noConstraintsMessage") }}
                        </b-alert>
                      </div>
                    </b-collapse>
                  </div>
                </div>
              </div>

              <div
                class="card-body"
                v-if="subpage === 'add' || subpage === 'edit'"
              >
                <div>
                  <ConstraintForm
                    @on-save="handleConstraintFormSave"
                    @on-cancel="handleConstraintFormCancel"
                    @on-edit="handleConstraintFormEdit"
                    :editMode="subpage === 'edit'"
                    :form="selectedConstraint"
                  />
                </div>
              </div>
              <div v-if="subpage === 'seedetails'">
                <ConstraintDetails
                  @on-return="subpage = 'home'"
                  :form="selectedConstraint"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/Page-header";
import appConfig from "../../../../app.config";
import { mapState } from "vuex";
import { ipcRenderer } from "electron";
import ConstraintForm from "@/components/ConstraintForm";
import ConstraintDetails from "@/components/ConstraintDetails";

export default {
  components: {
    Layout,
    PageHeader,
    ConstraintForm,
    ConstraintDetails,
  },
  page: {
    title: "Bmatch",
    meta: [{ name: "description", content: appConfig.description }],
  },

  computed: {
    ...mapState({
      constraints: (state) =>
        JSON.parse(JSON.stringify(state.project.base.constraints)),
    }),

    title() {
      return this.$t("constraints.title");
    },

    constraintsFormatted() {
      return this.constraints.map((c) => {
        return {
          ...c,
          content:
            c.content && c.content.length > this.maxStringSize
              ? c.content.substring(0, this.maxStringSize) + "..."
              : c.content,
          description:
            c.description && c.description.length > this.maxStringSize
              ? c.description.substring(0, this.maxStringSize) + "..."
              : c.description,
        };
      });
    },

    necessaryConstraints() {
      return this.constraintsFormatted.filter((c) => c.type === "necessary");
    },

    secondaryConstraints() {
      return this.constraintsFormatted.filter((c) => c.type === "secondary");
    },
  },
  data() {
    return {
      maxStringSize: 40,
      selectedConstraint: {},
      subpage: "home",
      pendingAlert: false,
      pendingRequest: {
        mode: "",
        form: {},
      },
      askingValidation: false,
      sendValidation: true,
      items: [
        {
          text: "Bmatch",
          href: "/",
        },
        {
          text: this.$t("common.project"),
          href: "/",
        },
        {
          text: this.$t("constraints.title"),
          active: true,
        },
      ],
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      ipcRenderer.removeAllListeners("constraint-validation-response");
      ipcRenderer.on(
        "constraint-validation-response",
        (event, validationResponse) => {
          if (validationResponse.message === "validation-success") {
            if (this.pendingRequest.mode === "add") {
              ipcRenderer.send("add-constraint", this.pendingRequest.form);
            } else if (this.pendingRequest.mode === "edit") {
              ipcRenderer.send("edit-constraint", this.pendingRequest.form);
            }
            this.subpage = "home";
          } else {
            this.$bvToast.toast(this.$t("constraints.wrongSyntaxMessage"), {
              title: this.$t("common.syntaxError"),
              autoHideDelay: 5000,
              variant: "danger",
              appendToast: true,
            });
          }
          this.askingValidation = false;
        }
      );
    },
    seeDetails(c) {
      this.selectedConstraint = this.constraints.find((c2) => c2.id === c.id);
      this.subpage = "seedetails";
    },
    handleEditMode(c) {
      this.selectedConstraint = this.constraints.find((c2) => c2.id === c.id);
      this.subpage = "edit";
    },
    deleteConstraint(c) {
      ipcRenderer.send("delete-constraint", c.id);
    },
    handleConstraintFormSave(form) {
      if (!this.askingValidation) {
        this.askingValidation = true;
        this.pendingRequest = {
          mode: "add",
          form,
        };
        ipcRenderer.send("ask-constraint-validation", form.content);
      }
    },
    handleConstraintFormCancel() {
      this.subpage = "home";
    },
    handleConstraintFormEdit(form) {
      if (!this.askingValidation) {
        this.askingValidation = true;
        this.pendingRequest = {
          mode: "edit",
          form,
        };
        ipcRenderer.send("ask-constraint-validation", form.content);
      }
    },
    addConstraint() {
      this.subpage = "add";
    },
  },

  middleware: "router-auth",
};
</script>

<style scoped>
#container {
  height: 200px;
}
</style>
