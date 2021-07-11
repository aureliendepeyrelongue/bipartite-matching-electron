import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    base: {
      tables: {
        tableA: {
          location: "",
          data: [],
          columnNames: [],
          constants: [],
        },
        tableB: {
          location: "",
          data: [],
          columnNames: [],
          constants: [],
        },
      },
      constraints: [
        {
          name: "",
          type: "",
          content: "",
          tokens: [],
          description: "",
        },
      ],
      matchingResult: {
        pairs: [],
        rejectedA: [],
        rejectedB: [],
      },
    },
  },
  mutations: {
    setBase(state, base) {
      state.base = base;
    },
  },
  actions: {},
  modules: {},
});
