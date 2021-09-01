<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row mb-md-2">
              <div class="col-sm-12">
                <a
                  href="#"
                  class="btn btn-outline-primary waves-effect waves-light"
                  @click="startMatching()"
                >
                  <i class="fe-plus mr-1"></i>{{ $t("matching.start") }}
                </a>
                <a
                  href="#"
                  class="btn btn-outline-success waves-effect ml-2 waves-light"
                  @click="exportCSV()"
                >
                  <i class="fe-download mr-1"></i>{{ $t("matching.exportCSV") }}
                </a>
              </div>
            </div>
            <div
              v-if="
                !(
                  matchingResult &&
                  ((matchingResult.pairs && matchingResult.pairs.length) ||
                    (matchingResult.rejectedA &&
                      matchingResult.rejectedA.length) ||
                    (matchingResult.rejectedB &&
                      matchingResult.rejectedB.length))
                )
              "
              class="mt-3"
            >
              <b-alert variant="info" show>
                {{ $t("matching.noMatchingMessage") }}
              </b-alert>
            </div>
            <div
              v-if="
                matchingResult &&
                  matchingResult.pairs &&
                  matchingResult.pairs.length
              "
            >
              <h5 class="mt-4">
                {{ $t("matching.pairsFound") }}
                <span v-if="matchingResult && matchingResult.pairs"
                  >({{ matchingResult.pairs.length / 2 }})</span
                >
              </h5>

              <div class="table-responsive mb-0">
                <b-table
                  :responsive="true"
                  :per-page="perPage"
                  :current-page="currentPagePairs"
                  v-if="matchingResult.pairs"
                  :items="pairsComputed"
                  :fields="matchingResult.pairsColumns"
                ></b-table>
              </div>
              <div class="row">
                <div class="col">
                  <div
                    class="dataTables_paginate paging_simple_numbers float-right"
                  >
                    <ul class="pagination pagination-rounded mb-0">
                      <b-pagination
                        v-model="currentPagePairs"
                        :total-rows="rowsPairs"
                        :per-page="perPage"
                      ></b-pagination>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="
                matchingResult &&
                  matchingResult.rejectedA &&
                  matchingResult.rejectedA.length
              "
            >
              <h5 class="mt-5">
                {{ $t("matching.rejectedMentees") }}
                <span v-if="matchingResult && matchingResult.rejectedA"
                  >({{ matchingResult.rejectedA.length }})</span
                >
              </h5>

              <div class="table-responsive mb-0">
                <b-table
                  :responsive="true"
                  :per-page="perPage"
                  :current-page="currentPageA"
                  v-if="matchingResult.rejectedA"
                  :items="rejectedAComputed"
                  :fields="tables.tableA.columns.map((c) => c.orign)"
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
                        :total-rows="rowsRejectedA"
                        :per-page="perPage"
                      ></b-pagination>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="
                matchingResult &&
                  matchingResult.rejectedB &&
                  matchingResult.rejectedB.length
              "
            >
              <h5 class="mt-5">
                {{ $t("matching.rejectedMentors") }}
                <span v-if="matchingResult && matchingResult.rejectedB"
                  >({{ matchingResult.rejectedB.length }})</span
                >
              </h5>

              <div class="table-responsive mb-0">
                <b-table
                  :responsive="true"
                  :per-page="perPage"
                  :current-page="currentPageB"
                  v-if="matchingResult.rejectedB"
                  :items="rejectedBComputed"
                  :fields="tables.tableB.columns.map((c) => c.orign)"
                ></b-table>
              </div>
              <div class="row">
                <div class="col">
                  <div
                    class="dataTables_paginate paging_simple_numbers float-right"
                  >
                    <ul class="pagination pagination-rounded mb-0">
                      <b-pagination
                        v-model="currentPageB"
                        :total-rows="rowsRejectedB"
                        :per-page="perPage"
                      ></b-pagination>
                    </ul>
                  </div>
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
import { ipcRenderer } from "electron";
import { mapState } from "vuex";

export default {
  page: {
    title: "Bmatch",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      currentPagePairs: 1,
      currentPageA: 1,
      currentPageB: 1,

      perPage: 10,
    };
  },
  computed: {
    rowsPairs() {
      return this.matchingResult && this.matchingResult.pairs
        ? this.matchingResult.pairs.length
        : 0;
    },
    rowsRejectedA() {
      return this.matchingResult && this.matchingResult.rejectedA
        ? this.matchingResult.rejectedA.length
        : 0;
    },
    rowsRejectedB() {
      return this.matchingResult && this.matchingResult.rejectedB
        ? this.matchingResult.rejectedB.length
        : 0;
    },

    ...mapState({
      matchingResult: (state) =>
        JSON.parse(JSON.stringify(state.project.base.matchingResult)),
      tables: (state) => JSON.parse(JSON.stringify(state.project.base.tables)),
    }),

    pairsComputed() {
      const newTable = this.matchingResult.pairs;
      newTable.forEach((el) => {
        for (let name in el) {
          let val = el[name];
          el[name] = this.formatField(val);
        }
      });
      return newTable;
    },
    rejectedAComputed() {
      const newTable =
        this.matchingResult && this.matchingResult.rejectedA
          ? this.matchingResult.rejectedA
          : [];

      newTable.forEach((el) => {
        for (let name in el) {
          let val = el[name];
          el[name] = this.formatField(val);
        }
      });
      return newTable;
    },
    rejectedBComputed() {
      const newTable =
        this.matchingResult && this.matchingResult.rejectedB
          ? this.matchingResult.rejectedB
          : [];

      newTable.forEach((el) => {
        for (let name in el) {
          let val = el[name];
          el[name] = this.formatField(val);
        }
      });
      return newTable;
    },

    title() {
      return this.$t("matching.title");
    },

    items() {
      return [
        {
          text: "Bmatch",
          href: "/",
        },
        {
          text: this.$t("common.project"),
          href: "/",
        },
        {
          text: this.$t("matching.title"),
          active: true,
        },
      ];
    },
  },

  methods: {
    exportCSV() {
      ipcRenderer.send("csv-export");
    },
    formatField(str) {
      if (typeof str === "string")
        return str.length > 40 ? str.substring(0, 40) + "..." : str;
      else return str;
    },
    startMatching() {
      ipcRenderer.send("start-matching");
    },
  },
  middleware: "router-auth",
};
</script>
