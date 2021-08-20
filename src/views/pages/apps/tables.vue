<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="text-left">
              <div
                class="fileupload btn btn-outline-primary waves-effect waves-light mb-3"
                @click="uploadTableA()"
              >
                <span>
                  <i class="mdi mdi-cloud-upload mr-1"></i>
                  {{ $t("tables.menteesTables") }}
                </span>
              </div>
              <div
                class="fileupload btn btn-outline-primary waves-effect waves-light ml-2 mb-3"
                @click="uploadTableB()"
              >
                <span>
                  <i class="mdi mdi-cloud-upload mr-1"></i>
                  {{ $t("tables.mentorsTables") }}
                </span>
              </div>
            </div>

            <div
              class="table-responsive"
              v-if="fileManagerData && fileManagerData.length"
            >
              <table class="table table-centered mb-0">
                <thead class="font-13 bg-light text-muted">
                  <tr>
                    <th class="font-weight-medium">{{ $t("common.name") }}</th>
                    <th class="font-weight-medium">{{ $t("common.type") }}</th>
                    <th class="font-weight-medium">
                      {{ $t("common.updatedAt") }}
                    </th>
                    <th class="font-weight-medium">{{ $t("common.size") }}</th>
                    <th
                      class="font-weight-medium text-center"
                      style="width: 125px"
                    >
                      {{ $t("common.actions") }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="tableData in fileManagerData"
                    :key="tableData.name"
                  >
                    <td>
                      <img
                        v-if="tableData.icon"
                        :src="`${tableData.icon}`"
                        height="30"
                        alt="icon"
                        class="mr-2"
                      />
                      <a href="javascript:void(0);" class="text-dark">{{
                        tableData.name
                      }}</a>
                    </td>
                    <td>
                      <a href="javascript:void(0);" class="text-dark">{{
                        tableData.type === "A"
                          ? $t("common.mentees")
                          : $t("common.mentors")
                      }}</a>
                    </td>
                    <td class="text-muted font-13">{{ tableData.date }}</td>
                    <td>{{ tableData.size }}</td>
                    <td>
                      <ul class="list-inline table-action m-0">
                        <li class="list-inline-item">
                          <a
                            href="javascript:void(0);"
                            class="action-icon px-1"
                            @click="showTableModal(tableData.type)"
                          >
                            <i class="mdi mdi-pencil"></i
                          ></a>
                        </li>
                        <li class="list-inline-item">
                          <a
                            href="javascript:void(0);"
                            class="action-icon px-1"
                          >
                            <i class="mdi mdi-delete"></i
                          ></a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <b-alert variant="info" show>
                {{ $t("tables.noTablesMessage") }}
              </b-alert>
            </div>
            <div
              v-if="
                tables.tableA && tables.tableA.data && tables.tableA.data.length
              "
            >
              <h5>{{ $t("tables.menteesTables") }}</h5>
              <div class="table-responsive mb-0">
                <b-table
                  :responsive="true"
                  :per-page="perPage"
                  :current-page="currentPageA"
                  v-if="tables.tableA"
                  :items="formatTableA"
                  :fields="tables.tableA.columns.map((c) => c.origin)"
                ></b-table>
              </div>
              <div class="row">
                <div class="col">
                  <div
                    class="dataTables_paginate paging_simple_numbers float-right"
                  >
                    <ul class="pagination pagination-rounded mb-0">
                      <b-pagination
                        v-model="currentPageA"
                        :total-rows="rowsA"
                        :per-page="perPage"
                      ></b-pagination>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="
                tables.tableB && tables.tableB.data && tables.tableB.data.length
              "
            >
              <h5>{{ $t("tables.mentorsTables") }}</h5>
              <div class="table-responsive mb-0">
                <b-table
                  :responsive="true"
                  :per-page="perPage"
                  :current-page="currentPageB"
                  v-if="tables.tableB"
                  :items="formatTableB"
                  :fields="tables.tableB.columns.map((c) => c.origin)"
                ></b-table>
              </div>
              <div class="row">
                <div class="col">
                  <div
                    class="dataTables_paginate paging_simple_numbers float-right"
                  >
                    <ul class="pagination pagination-rounded mb-0">
                      <!-- pagination -->
                      <b-pagination
                        v-model="currentPageB"
                        :total-rows="rowsB"
                        :per-page="perPage"
                      ></b-pagination>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <b-modal
            id="edit-tables-modal"
            scrollable
            :title="$t('tables.edit')"
            title-tag="h5"
            size="lg"
            @ok="updateColumns"
          >
            <div>
              <h5>{{ $t("tables.columns") }}</h5>
              <table
                v-if="
                  selectedTable &&
                    selectedTable.columns &&
                    selectedTable.columns.length
                "
                class="table"
              >
                <tr>
                  <th>{{ $t("common.column") }}</th>
                  <th>{{ $t("common.associatedVariable") }}</th>
                  <th>{{ $t("common.type") }}</th>
                </tr>
                <tr
                  v-for="(column, index) in selectedTable.columns"
                  :key="index"
                >
                  <td>
                    {{ column.origin }}
                  </td>

                  <td>
                    {{ column.target }}
                  </td>
                  <td>
                    <b-form-select
                      v-model="column.type"
                      :options="columnsTypeOptions"
                    ></b-form-select>
                  </td>
                </tr>
              </table>
            </div>
          </b-modal>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/Page-header";
import appConfig from "../../../../app.config";
import { ipcRenderer } from "electron";
import { mapState } from "vuex";

export default {
  components: {
    Layout,
    PageHeader,
  },
  page: {
    title: "Bmatch",
    meta: [{ name: "description", content: appConfig.description }],
  },
  computed: {
    rowsA() {
      return this.tables && this.tables.tableA
        ? this.tables.tableA.data.length
        : 0;
    },
    rowsB() {
      return this.tables && this.tables.tableB
        ? this.tables.tableB.data.length
        : 0;
    },
    formatTableA() {
      const newTable = this.tables.tableA.data;
      newTable.forEach((el) => {
        for (let name in el) {
          let val = el[name];
          el[name] = this.formatField(val);
        }
      });
      return newTable;
    },
    formatTableB() {
      const newTable = this.tables.tableB.data;
      newTable.forEach((el) => {
        for (let name in el) {
          let val = el[name];
          el[name] = this.formatField(val);
        }
      });
      return newTable;
    },
    ...mapState({
      tables: (state) => JSON.parse(JSON.stringify(state.project.base.tables)),
    }),

    title() {
      return this.$t("tables.title");
    },

    fileManagerData() {
      let tables = [];
      if (!this.tables.tableA.empty) {
        tables.push(this.getFileData("A", this.tables.tableA));
      }
      if (!this.tables.tableB.empty) {
        tables.push(this.getFileData("B", this.tables.tableB));
      }
      return tables;
    },
  },
  data() {
    return {
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
          text: this.$t("tables.title"),
          active: true,
        },
      ],
      selectedType: "",
      columnsTypeOptions: [
        { value: "string", text: this.$t("common.text") },
        { value: "number", text: this.$t("common.number") },
      ],
      selectedTable: null,
      currentPageA: 1,
      currentPageB: 1,
      perPage: 20,
      constantName: "",
      constantValue: "",
    };
  },

  methods: {
    formatField(str) {
      return str.length > 40 ? str.substring(0, 40) + "..." : str;
    },
    getFileData(tableType, table) {
      return {
        type: tableType,
        icon: require("@/assets/images/file-icons/txt.svg"),
        name: table.location,
        date: "21-May-18 1:12 PM",
        size: table.data.length + " " + this.$t("common.lines"),
        users: [require("@/assets/images/users/avatar-5.jpg")],
      };
    },
    addConstraint() {
      ipcRenderer.send("add-constant", {
        tableType: this.selectedTable.type,
        key: this.constantName,
        value: this.constantValue,
      });
    },
    showTableModal(type) {
      if (type === "A") {
        this.selectedTable = this.tables.tableA;
        this.selectedType = "A";
      } else if (type === "B") {
        this.selectedTable = this.tables.tableB;
        this.selectedType = "B";
      }
      this.selectedTable.type = type;
      this.$bvModal.show("edit-tables-modal");
    },
    uploadTableA() {
      ipcRenderer.send("load-table-a", "");
    },
    uploadTableB() {
      ipcRenderer.send("load-table-b", "");
    },

    updateColumns() {
      ipcRenderer.send("update-columns", {
        type: this.selectedType,
        columns: this.selectedTable.columns,
      });
    },
  },
  middleware: "router-auth",
};
</script>
