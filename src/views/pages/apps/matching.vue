<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h4 class="header-title">Advanced Data Table</h4>

            <p class="text-muted font-13 mb-4"></p>
            <div class="row mb-md-2">
              <div class="col-sm-3">
                <a
                  href="#"
                  class="btn btn-primary waves-effect waves-light"
                  @click="startMatching()"
                >
                  <i class="fe-plus mr-1"></i>Lancer le matching
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import { tableData } from "./data";

import Layout from "../../layouts/main";
import PageHeader from "@/components/Page-header";
import appConfig from "../../../../app.config";
import { ipcRenderer } from "electron";

/**
 * Advanced Table component
 */
export default {
  page: {
    title: "Advanced Table",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      tableData: tableData,
      title: "Matching",
      items: [
        {
          text: "Minton",
          href: "/",
        },
        {
          text: "Tables",
          href: "/",
        },
        {
          text: "Advanced",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "age",
      sortDesc: false,
      fields: [
        {
          key: "name",
          sortable: true,
        },
        {
          key: "position",
          sortable: true,
        },
        {
          key: "office",
          sortable: true,
        },
        {
          key: "age",
          sortable: true,
        },
        {
          key: "date",
          sortable: true,
        },
        {
          key: "salary",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.tableData.length;
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  methods: {
    startMatching() {
      ipcRenderer.send("start-matching");
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  middleware: "router-auth",
};
</script>
