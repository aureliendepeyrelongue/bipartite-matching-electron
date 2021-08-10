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
                  <div class="col-sm-3">
                    <a
                      href="#"
                      class="btn btn-primary waves-effect waves-light"
                      @click="addConstraint()"
                    >
                      <i class="fe-plus mr-1"></i>Ajouter une contrainte
                    </a>
                  </div>
                  <div class="col-sm-9">
                    <div class="float-sm-right mt-3 mt-sm-0">
                      <div class="form-inline">
                        <div class="mb-3 mb-sm-0 mr-sm-2">
                          <form>
                            <div class="position-relative">
                              <input
                                type="text"
                                class="form-control"
                                placeholder="Search..."
                              />
                            </div>
                          </form>
                        </div>
                        <b-dropdown variant="light" right>
                          <template v-slot:button-content>
                            <i class="mdi mdi-filter-variant"></i>
                          </template>
                          <b-dropdown-item>Due Date</b-dropdown-item>
                          <b-dropdown-item>Added Date</b-dropdown-item>
                          <b-dropdown-item>Assignee</b-dropdown-item>
                        </b-dropdown>
                      </div>
                    </div>
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
                        Contraintes nécessaires
                        <span class="text-muted"
                          >({{ necessaryConstraints.length }})</span
                        >
                        <i class="mdi mdi-chevron-down accordion-arrow"></i>
                      </a>
                    </h5>
                    <b-collapse visible id="taskcollapse1">
                      <div class="table-responsive mt-3">
                        <table
                          class="table table-centered table-nowrap table-borderless table-sm"
                        >
                          <thead class="thead-light">
                            <tr class>
                              <th scope="col">Nom</th>
                              <th scope="col">Aperçu</th>
                              <th scope="col">Description</th>
                              <th scope="col" style="width: 85px">Action</th>
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
                                  <li class="list-inline-item">
                                    <a
                                      href="javascript:void(0);"
                                      class="action-icon px-1"
                                    >
                                      <i class="mdi mdi-eye-outline"></i>
                                    </a>
                                  </li>
                                  <li class="list-inline-item">
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
                    </b-collapse>
                  </div>

                  <div class="mt-4">
                    <h5 class="position-relative mb-0">
                      <a
                        v-b-toggle.taskcollapse2
                        href="javascript: void(0);"
                        class="text-dark d-block"
                      >
                        Contraintes secondaires
                        <span class="text-muted"
                          >({{ secondaryConstraints.length }})</span
                        >
                        <i class="mdi mdi-chevron-down accordion-arrow"></i>
                      </a>
                    </h5>
                    <b-collapse visible id="taskcollapse2">
                      <div class="table-responsive mt-3">
                        <table
                          class="table table-centered table-nowrap table-borderless table-sm"
                        >
                          <thead class="thead-light">
                            <tr class>
                              <th scope="col">Nom</th>
                              <th scope="col">Aperçu</th>
                              <th scope="col">Description</th>
                              <th scope="col">Poids</th>
                              <th scope="col" style="width: 85px">Action</th>
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
                                  <li class="list-inline-item">
                                    <a
                                      href="javascript:void(0);"
                                      class="action-icon px-1"
                                    >
                                      <i class="mdi mdi-eye-outline"></i>
                                    </a>
                                  </li>
                                  <li class="list-inline-item">
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

export default {
  components: {
    Layout,
    PageHeader,
    ConstraintForm,
  },
  page: {
    title: "Task-list",
    meta: [{ name: "description", content: appConfig.description }],
  },

  computed: {
    ...mapState({
      constraints: (state) =>
        JSON.parse(JSON.stringify(state.project.base.constraints)),
    }),

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
      title: "Contraintes",
      selectedConstraint: {},
      subpage: "home",
      items: [
        {
          text: "Minton",
          href: "/",
        },
        {
          text: "Apps",
          href: "/",
        },
        {
          text: "File Manager",
          active: true,
        },
      ],
    };
  },
  mounted() {},

  methods: {
    handleEditMode(c) {
      this.selectedConstraint = this.constraints.find((c2) => c2.id === c.id);
      this.subpage = "edit";
    },
    handleConstraintFormSave(form) {
      this.subpage = "home";
      ipcRenderer.send("add-constraint", form);
    },
    handleConstraintFormCancel() {
      this.subpage = "home";
    },
    handleConstraintFormEdit(form) {
      this.subpage = "home";
      ipcRenderer.send("edit-constraint", form);
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
